import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import { getDb } from "./db";
import { poiData, trafficFlow, exclusionZones, chargingStations, analysisHistory, reportHistory, memorySessions } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { STATIC_POI_DATA, STATIC_TRAFFIC_FLOW, STATIC_EXCLUSION_ZONES, STATIC_CHARGING_STATIONS, getStaticDashboardStats } from "./staticData";

// ─── 地理计算工具 ───────────────────────────────────────────────
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dlat = (lat2 - lat1) * Math.PI / 180;
  const dlng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dlng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function pointInPolygon(lat: number, lng: number, coords: number[][]): boolean {
  let inside = false;
  let j = coords.length - 1;
  for (let i = 0; i < coords.length; i++) {
    const xi = coords[i][0], yi = coords[i][1];
    const xj = coords[j][0], yj = coords[j][1];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
    j = i;
  }
  return inside;
}

function getCategoryDisplay(cat: string): string {
  const map: Record<string, string> = {
    mall: "购物中心", hotel: "酒店", hospital: "医院", school: "学校",
    office: "写字楼", residential: "居住区", transport: "交通枢纽",
    gas_station: "加油站", parking: "停车场", restaurant: "餐饮",
    scenic: "景区", government: "政府机构",
  };
  return map[cat] ?? cat;
}

// ─── 智能评分引擎 ───────────────────────────────────────────────
async function quickScore(lat: number, lng: number) {
  const db = await getDb();

  const [pois, roads, zones, stations] = db ? await Promise.all([
    db.select().from(poiData),
    db.select().from(trafficFlow),
    db.select().from(exclusionZones),
    db.select().from(chargingStations),
  ]) : [
    STATIC_POI_DATA.map(p => ({ ...p, influenceWeight: 1.0, boundaryJson: null as string | null, createdAt: new Date() })),
    STATIC_TRAFFIC_FLOW.map(r => ({ ...r, heatWeight: 1.0, centerLat: r.latitude, centerLng: r.longitude, roadLevel: 'arterial', createdAt: new Date() })),
    STATIC_EXCLUSION_ZONES.map(z => ({ ...z, boundaryJson: null as string | null, createdAt: new Date() })),
    STATIC_CHARGING_STATIONS.map(s => ({ ...s, connectors: s.chargerCount, createdAt: new Date() })),
  ];

  // 禁区检查（一票否决）
  const conflicts: string[] = [];
  for (const zone of zones) {
    const dist = haversine(lat, lng, zone.centerLat, zone.centerLng);
    let inZone = dist <= zone.radiusKm;
    if (!inZone && zone.boundaryJson) {
      try {
        const boundary = JSON.parse(zone.boundaryJson);
        if (boundary?.type === "Polygon") {
          inZone = pointInPolygon(lat, lng, boundary.coordinates[0]);
        }
      } catch {}
    }
    if (inZone) conflicts.push(zone.name);
  }

  // POI评分（35%）- 2km范围
  const nearbyPois = pois
    .map(p => ({ ...p, dist: haversine(lat, lng, p.latitude, p.longitude) }))
    .filter(p => p.dist <= 2.0)
    .sort((a, b) => a.dist - b.dist);

  let poiScore = 0;
  if (nearbyPois.length > 0) {
    const weightedSum = nearbyPois.reduce((sum, p) => {
      const decay = Math.exp(-p.dist / 1.0);
      return sum + p.evDemandScore * p.influenceWeight * decay;
    }, 0);
    poiScore = Math.min(10, weightedSum / Math.max(nearbyPois.length * 0.8, 1));
  }

  // 交通评分（30%）- 3km范围
  const nearbyRoads = roads
    .map(r => ({ ...r, dist: haversine(lat, lng, r.centerLat, r.centerLng) }))
    .filter(r => r.dist <= 3.0)
    .sort((a, b) => a.dist - b.dist);

  let trafficScore = 0;
  if (nearbyRoads.length > 0) {
    const maxFlow = Math.max(...nearbyRoads.map(r => r.dailyFlow));
    trafficScore = nearbyRoads.slice(0, 3).reduce((sum, r) => {
      const normalized = r.dailyFlow / maxFlow;
      const evBonus = r.evRatio * 2;
      return sum + (normalized * 8 + evBonus) * r.heatWeight;
    }, 0) / Math.min(nearbyRoads.length, 3);
    trafficScore = Math.min(10, trafficScore);
  }

  // 可达性评分（20%）
  const roadLevelScores: Record<string, number> = {
    expressway: 10, arterial: 8.5, secondary: 7, branch: 5.5, other: 4
  };
  let accessScore = 4;
  if (nearbyRoads.length > 0) {
    const bestRoad = nearbyRoads[0];
    const levelScore = roadLevelScores[bestRoad.roadLevel] ?? 5;
    const distPenalty = Math.max(0, (bestRoad.dist - 0.5) * 2);
    accessScore = Math.min(10, Math.max(3, levelScore - distPenalty));
  }

  // 竞争评分（15%）- 1.5km内已有充电站
  const nearbyStations = stations
    .map(s => ({ ...s, dist: haversine(lat, lng, s.latitude, s.longitude) }))
    .filter(s => s.dist <= 1.5);
  const competitionScore = nearbyStations.length === 0 ? 9.5
    : nearbyStations.length === 1 ? 7.5
    : nearbyStations.length === 2 ? 5.5
    : Math.max(2, 5.5 - (nearbyStations.length - 2) * 1.5);

  const totalScore = conflicts.length > 0 ? 0 :
    Math.round((poiScore * 0.35 + trafficScore * 0.30 + accessScore * 0.20 + competitionScore * 0.15) * 10) / 10;

  const grade = totalScore >= 8.5 ? "优秀" : totalScore >= 7 ? "良好" : totalScore >= 5.5 ? "一般" : totalScore >= 4 ? "较差" : "不可用";

  return {
    totalScore,
    grade,
    exclusionConflicts: conflicts,
    scoreBreakdown: {
      poi: Math.round(poiScore * 10) / 10,
      traffic: Math.round(trafficScore * 10) / 10,
      accessibility: Math.round(accessScore * 10) / 10,
      competition: Math.round(competitionScore * 10) / 10,
    },
    nearbyPois: nearbyPois.slice(0, 8).map(p => ({
      id: p.id, name: p.name, category: p.category,
      categoryDisplay: getCategoryDisplay(p.category),
      dist: Math.round(p.dist * 1000) / 1000,
      dailyFlow: p.dailyFlow, evDemandScore: p.evDemandScore,
    })),
    nearbyRoads: nearbyRoads.slice(0, 5).map(r => ({
      id: r.id, name: r.roadName, level: r.roadLevel,
      dist: Math.round(r.dist * 1000) / 1000,
      dailyFlow: r.dailyFlow, evRatio: r.evRatio,
    })),
    nearbyStations: nearbyStations.map(s => ({
      id: s.id, name: s.name,
      dist: Math.round(s.dist * 1000) / 1000,
      connectors: s.connectors,
    })),
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ── 地图数据 ──
  maps: router({
    getPOI: publicProcedure
      .input(z.object({ category: z.string().optional(), district: z.string().optional() }).optional())
      .query(async ({ input }) => {
        const db = await getDb();
        const rows: any[] = db ? await db.select().from(poiData)
          : STATIC_POI_DATA.map(p => ({ ...p, influenceWeight: 1.0, boundaryJson: null, createdAt: new Date() }));
        const filtered = rows.filter((r: any) =>
          (!input?.category || r.category === input.category) &&
          (!input?.district || r.district.includes(input.district ?? ""))
        );
        return { data: filtered, total: filtered.length };
      }),

    getTrafficFlow: publicProcedure.query(async () => {
      const db = await getDb();
      const rows: any[] = db ? await db.select().from(trafficFlow)
        : STATIC_TRAFFIC_FLOW.map(r => ({ ...r, heatWeight: 1.0, centerLat: r.latitude, centerLng: r.longitude, roadLevel: 'arterial', createdAt: new Date() }));
      return { data: rows, total: rows.length };
    }),

    getExclusionZones: publicProcedure.query(async () => {
      const db = await getDb();
      const rows: any[] = db ? await db.select().from(exclusionZones)
        : STATIC_EXCLUSION_ZONES.map(z => ({ ...z, boundaryJson: null, createdAt: new Date() }));
      return { data: rows, total: rows.length };
    }),

    getChargingStations: publicProcedure.query(async () => {
      const db = await getDb();
      const rows: any[] = db ? await db.select().from(chargingStations)
        : STATIC_CHARGING_STATIONS.map(s => ({ ...s, connectors: s.chargerCount, createdAt: new Date() }));
      return { data: rows, total: rows.length };
    }),

    getDashboardStats: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return getStaticDashboardStats();
      const [pois, roads, zones, stations] = await Promise.all([
        db.select().from(poiData),
        db.select().from(trafficFlow),
        db.select().from(exclusionZones),
        db.select().from(chargingStations),
      ]);
      const catMap: Record<string, number> = {};
      pois.forEach(p => { const k = getCategoryDisplay(p.category); catMap[k] = (catMap[k] || 0) + 1; });
      const districtMap: Record<string, number> = {};
      roads.forEach(r => {
        const d = r.district.split("/")[0];
        districtMap[d] = (districtMap[d] || 0) + r.dailyFlow;
      });
      const scoreRanges = [
        { range: "9-10分", count: pois.filter(p => p.evDemandScore >= 9).length },
        { range: "8-9分", count: pois.filter(p => p.evDemandScore >= 8 && p.evDemandScore < 9).length },
        { range: "7-8分", count: pois.filter(p => p.evDemandScore >= 7 && p.evDemandScore < 8).length },
        { range: "6-7分", count: pois.filter(p => p.evDemandScore >= 6 && p.evDemandScore < 7).length },
        { range: "<6分", count: pois.filter(p => p.evDemandScore < 6).length },
      ];
      const topPois = [...pois].sort((a, b) => b.evDemandScore - a.evDemandScore).slice(0, 10);
        const districtSet = new Set(pois.map(p => p.district.split("区")[0] + "区"));
        const districts = Array.from(districtSet);
      return {
        kpi: { districts: districts.length, poiCount: pois.length, roadCount: roads.length, stationCount: stations.length, exclusionCount: zones.length },
        poiCategoryChart: Object.entries(catMap).map(([name, value]) => ({ name, value })),
        trafficDistrictChart: Object.entries(districtMap).map(([name, value]) => ({ name, value: Math.round(value / 1000) })),
        evDemandChart: scoreRanges,
        topPois: topPois.map(p => ({
          id: p.id, name: p.name, category: getCategoryDisplay(p.category),
          district: p.district, dailyFlow: p.dailyFlow, evDemandScore: p.evDemandScore,
          lat: p.latitude, lng: p.longitude,
        })),
      };
    }),
  }),

  // ── 智能分析 ──
  analysis: router({
    quickScore: publicProcedure
      .input(z.object({ lat: z.number(), lng: z.number() }))
      .mutation(async ({ input }) => quickScore(input.lat, input.lng)),

    aiAnalysis: publicProcedure
      .input(z.object({
        lat: z.number(), lng: z.number(),
        userMessage: z.string(), sessionId: z.string(),
        history: z.array(z.object({ role: z.string(), content: z.string() })).optional(),
      }))
      .mutation(async ({ input }) => {
        const score = await quickScore(input.lat, input.lng);
        const systemPrompt = `你是福州市新能源充电桩智能选址助手，专业分析充电桩选址可行性。
当前分析位置：纬度${input.lat.toFixed(4)}，经度${input.lng.toFixed(4)}
快速评分：综合${score.totalScore}/10（${score.grade}）| POI密度${score.scoreBreakdown.poi}/10 | 交通流量${score.scoreBreakdown.traffic}/10 | 可达性${score.scoreBreakdown.accessibility}/10 | 竞争${score.scoreBreakdown.competition}/10
禁区冲突：${score.exclusionConflicts.length > 0 ? score.exclusionConflicts.join("、") : "无"}
周边POI：${score.nearbyPois.slice(0, 5).map(p => `${p.name}(${p.dist}km)`).join("、")}
周边道路：${score.nearbyRoads.slice(0, 3).map(r => `${r.name}(日均${r.dailyFlow}辆)`).join("、")}
请基于以上数据，用专业简洁的中文回答用户问题，给出具体可行的建议。`;

        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...(input.history?.slice(-6).map(h => ({ role: h.role as "user" | "assistant", content: h.content })) ?? []),
          { role: "user" as const, content: input.userMessage },
        ];
        const response = await invokeLLM({ messages });
        const content = response.choices[0]?.message?.content ?? "分析完成，请查看评分结果。";

        const db = await getDb();
        if (db) {
          const ahValues = {
            sessionId: input.sessionId, lat: input.lat, lng: input.lng,
            userMessage: String(input.userMessage), aiResponse: String(content),
            totalScore: score.totalScore,
            scoreBreakdown: JSON.stringify(score.scoreBreakdown),
          };
          await db.insert(analysisHistory).values(ahValues);
          await db.insert(memorySessions).values({
            sessionId: input.sessionId,
            label: `会话 ${new Date().toLocaleDateString("zh-CN")}`,
          }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
        }
        return { content, score };
      }),

    getHistory: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return await db.select().from(analysisHistory)
          .where(eq(analysisHistory.sessionId, input.sessionId))
          .orderBy(desc(analysisHistory.createdAt)).limit(50);
      }),
  }),

  // ── 报告 ──
  reports: router({
    generate: publicProcedure
      .input(z.object({ lat: z.number(), lng: z.number(), address: z.string(), sessionId: z.string() }))
      .mutation(async ({ input }) => {
        const score = await quickScore(input.lat, input.lng);
        const prompt = `请为以下充电桩选址生成专业的分析报告（Markdown格式，结构清晰）：
位置：${input.address}（${input.lat.toFixed(4)}, ${input.lng.toFixed(4)}）
综合评分：${score.totalScore}/10（${score.grade}）
各维度：POI密度${score.scoreBreakdown.poi}/10、交通流量${score.scoreBreakdown.traffic}/10、可达性${score.scoreBreakdown.accessibility}/10、竞争${score.scoreBreakdown.competition}/10
周边POI：${score.nearbyPois.slice(0, 6).map(p => `${p.name}(${p.categoryDisplay},${p.dist}km)`).join("、")}
周边道路：${score.nearbyRoads.slice(0, 4).map(r => `${r.name}(日均${r.dailyFlow}辆,新能源${(r.evRatio * 100).toFixed(0)}%)`).join("、")}
禁区冲突：${score.exclusionConflicts.length > 0 ? score.exclusionConflicts.join("、") : "无"}
请生成包含：1.选址概述 2.评分详析 3.周边环境 4.竞争态势 5.风险评估 6.综合建议 的完整报告。`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "你是专业的新能源充电桩选址顾问，生成结构清晰、数据详实的选址分析报告。" },
            { role: "user", content: prompt },
          ],
        });
        const reportContent = response.choices[0]?.message?.content ?? "报告生成失败，请重试。";

        const db = await getDb();
        if (db) {
          const rhValues = {
            sessionId: input.sessionId, address: input.address,
            lat: input.lat, lng: input.lng, totalScore: score.totalScore,
            reportContent: String(reportContent), scoreBreakdown: JSON.stringify(score.scoreBreakdown),
          };
          await db.insert(reportHistory).values(rhValues);
        }
        return { reportContent, score, address: input.address };
      }),

    list: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return await db.select().from(reportHistory)
          .where(eq(reportHistory.sessionId, input.sessionId))
          .orderBy(desc(reportHistory.createdAt)).limit(20);
      }),
  }),

  // ── 历史记忆 ──
  memory: router({
    getSessions: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(memorySessions).orderBy(desc(memorySessions.updatedAt)).limit(20);
    }),

    clearSession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        await db.delete(analysisHistory).where(eq(analysisHistory.sessionId, input.sessionId));
        await db.delete(reportHistory).where(eq(reportHistory.sessionId, input.sessionId));
        await db.delete(memorySessions).where(eq(memorySessions.sessionId, input.sessionId));
        return { success: true };
      }),

    getKnowledgeGraph: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { nodes: [], links: [] };
      const [pois, roads, zones, stations] = await Promise.all([
        db.select().from(poiData).limit(20),
        db.select().from(trafficFlow).limit(10),
        db.select().from(exclusionZones).limit(8),
        db.select().from(chargingStations),
      ]);
      const nodes: { id: string; name: string; category: number; value: number }[] = [];
      const links: { source: string; target: string; relation: string }[] = [];

      pois.forEach(p => nodes.push({ id: `poi_${p.id}`, name: p.name, category: 0, value: p.evDemandScore }));
      roads.forEach(r => nodes.push({ id: `road_${r.id}`, name: r.roadName, category: 1, value: Math.min(10, r.dailyFlow / 8000) }));
      zones.forEach(z => nodes.push({ id: `zone_${z.id}`, name: z.name, category: 2, value: 5 }));
      stations.forEach(s => nodes.push({ id: `station_${s.id}`, name: s.name, category: 3, value: s.connectors }));

      pois.forEach(p => {
        roads.forEach(r => {
          if (haversine(p.latitude, p.longitude, r.centerLat, r.centerLng) < 2.0)
            links.push({ source: `poi_${p.id}`, target: `road_${r.id}`, relation: "邻近道路" });
        });
        stations.forEach(s => {
          if (haversine(p.latitude, p.longitude, s.latitude, s.longitude) < 1.5)
            links.push({ source: `poi_${p.id}`, target: `station_${s.id}`, relation: "服务覆盖" });
        });
      });
      return { nodes, links };
    }),
  }),
});

export type AppRouter = typeof appRouter;
