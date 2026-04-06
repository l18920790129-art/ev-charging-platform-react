import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Network } from "lucide-react";
import * as echarts from "echarts";

export default function KnowledgeGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const { data: poiResult } = trpc.maps.getPOI.useQuery();
  const { data: stationsResult } = trpc.maps.getChargingStations.useQuery();
  const { data: zonesResult } = trpc.maps.getExclusionZones.useQuery();
  const { data: trafficResult } = trpc.maps.getTrafficFlow.useQuery();

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, "dark");

    const nodes: any[] = [];
    const edges: any[] = [];

    // 中心节点
    nodes.push({ id: "center", name: "福州充电桩选址", symbolSize: 50, category: 0, value: "核心" });

    // 区域节点
    const districts = new Set<string>();
    (poiResult?.data ?? []).forEach(p => districts.add(p.district.replace(/[东西南北中]/g, "").substring(0, 2) + "区"));
    Array.from(districts).forEach(d => {
      nodes.push({ id: `dist_${d}`, name: d, symbolSize: 28, category: 1 });
      edges.push({ source: "center", target: `dist_${d}`, value: "覆盖" });
    });

    // POI节点（取前15个）
    (poiResult?.data ?? []).slice(0, 15).forEach(p => {
      nodes.push({ id: `poi_${p.id}`, name: p.name.substring(0, 6), symbolSize: 14 + p.evDemandScore, category: 2, value: `需求:${p.evDemandScore}` });
      const distKey = `dist_${p.district.replace(/[东西南北中]/g, "").substring(0, 2)}区`;
      edges.push({ source: distKey, target: `poi_${p.id}`, value: "包含" });
    });

    // 充电站节点
    (stationsResult?.data ?? []).forEach(s => {
      nodes.push({ id: `sta_${s.id}`, name: s.name.substring(0, 6), symbolSize: 20, category: 3, value: `${s.connectors}枪` });
      edges.push({ source: "center", target: `sta_${s.id}`, value: "现有站" });
    });

    // 禁区节点（取前5个）
    (zonesResult?.data ?? []).slice(0, 5).forEach(z => {
      nodes.push({ id: `zone_${z.id}`, name: z.name.substring(0, 6), symbolSize: 16, category: 4, value: "禁区" });
      edges.push({ source: "center", target: `zone_${z.id}`, value: "禁止" });
    });

    // 道路节点（取前8条）
    (trafficResult?.data ?? []).slice(0, 8).forEach(r => {
      nodes.push({ id: `road_${r.id}`, name: r.roadName.substring(0, 6), symbolSize: 12 + r.dailyFlow / 10000, category: 5, value: `${(r.dailyFlow / 1000).toFixed(0)}k辆` });
      edges.push({ source: "center", target: `road_${r.id}`, value: "监控" });
    });

    chart.setOption({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: (p: any) => `<b>${p.data.name}</b><br/>${p.data.value ?? ""}`,
      },
      legend: {
        data: ["核心", "行政区", "POI点位", "充电站", "禁止区域", "主干道"],
        textStyle: { color: "oklch(0.65 0.02 240)", fontSize: 11 },
        bottom: 10,
        icon: "circle",
      },
      series: [{
        type: "graph",
        layout: "force",
        data: nodes,
        links: edges,
        categories: [
          { name: "核心", itemStyle: { color: "oklch(0.62 0.22 200)" } },
          { name: "行政区", itemStyle: { color: "oklch(0.68 0.20 280)" } },
          { name: "POI点位", itemStyle: { color: "oklch(0.52 0.24 170)" } },
          { name: "充电站", itemStyle: { color: "oklch(0.75 0.18 60)" } },
          { name: "禁止区域", itemStyle: { color: "oklch(0.62 0.22 25)" } },
          { name: "主干道", itemStyle: { color: "oklch(0.72 0.20 145)" } },
        ],
        roam: true,
        draggable: true,
        label: { show: true, position: "right", fontSize: 10, color: "oklch(0.75 0.01 240)" },
        force: { repulsion: 120, gravity: 0.08, edgeLength: [60, 150] },
        lineStyle: { color: "oklch(0.35 0.03 240)", width: 1, curveness: 0.1 },
        emphasis: {
          focus: "adjacency",
          lineStyle: { width: 2 },
        },
      }],
    });

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => { chart.dispose(); ro.disconnect(); };
  }, [poiResult, stationsResult, zonesResult, trafficResult]);

  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">知识图谱</h1>
        <p className="text-sm text-muted-foreground mt-0.5">POI、道路、充电站、禁区等地理实体关联关系可视化</p>
      </div>

      <div className="flex gap-3 shrink-0 flex-wrap">
        {[
          { color: "oklch(0.62 0.22 200)", label: "核心节点" },
          { color: "oklch(0.68 0.20 280)", label: "行政区" },
          { color: "oklch(0.52 0.24 170)", label: "POI点位" },
          { color: "oklch(0.75 0.18 60)", label: "充电站" },
          { color: "oklch(0.62 0.22 25)", label: "禁止区域" },
          { color: "oklch(0.72 0.20 145)", label: "主干道" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            {label}
          </div>
        ))}
        <div className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
          <Network className="w-3 h-3" />
          可拖拽 · 滚轮缩放
        </div>
      </div>

      <div className="flex-1 tech-card overflow-hidden">
        <div ref={ref} className="w-full h-full" />
      </div>
    </div>
  );
}
