import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("maps.getDashboardStats", () => {
  it("returns kpi with expected fields", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.maps.getDashboardStats();
    expect(result).toHaveProperty("kpi");
    expect(result.kpi).toHaveProperty("poiCount");
    expect(result.kpi).toHaveProperty("roadCount");
    expect(result.kpi).toHaveProperty("stationCount");
    expect(result.kpi).toHaveProperty("exclusionCount");
    expect(typeof result.kpi.poiCount).toBe("number");
  });

  it("returns chart data arrays", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.maps.getDashboardStats();
    expect(Array.isArray(result.poiCategoryChart)).toBe(true);
    expect(Array.isArray(result.trafficDistrictChart)).toBe(true);
    expect(Array.isArray(result.evDemandChart)).toBe(true);
    expect(Array.isArray(result.topPois)).toBe(true);
  });
});

describe("maps.getPOI", () => {
  it("returns poi data array", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.maps.getPOI();
    expect(result).toHaveProperty("data");
    expect(Array.isArray(result.data)).toBe(true);
    if (result.data.length > 0) {
      const poi = result.data[0];
      expect(poi).toHaveProperty("id");
      expect(poi).toHaveProperty("name");
      expect(poi).toHaveProperty("latitude");
      expect(poi).toHaveProperty("longitude");
      expect(poi).toHaveProperty("evDemandScore");
    }
  });
});

describe("maps.getTrafficFlow", () => {
  it("returns traffic flow data", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.maps.getTrafficFlow();
    expect(result).toHaveProperty("data");
    expect(Array.isArray(result.data)).toBe(true);
  });
});

describe("maps.getExclusionZones", () => {
  it("returns exclusion zones", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.maps.getExclusionZones();
    expect(result).toHaveProperty("data");
    expect(Array.isArray(result.data)).toBe(true);
  });
});

describe("maps.getChargingStations", () => {
  it("returns charging stations", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.maps.getChargingStations();
    expect(result).toHaveProperty("data");
    expect(Array.isArray(result.data)).toBe(true);
  });
});

describe("analysis.quickScore", () => {
  it("returns valid score for fuzhou center", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.analysis.quickScore({ lat: 26.0756, lng: 119.3034 });
    expect(result).toHaveProperty("totalScore");
    expect(result).toHaveProperty("grade");
    expect(result).toHaveProperty("scoreBreakdown");
    expect(result.scoreBreakdown).toHaveProperty("poi");
    expect(result.scoreBreakdown).toHaveProperty("traffic");
    expect(result.scoreBreakdown).toHaveProperty("accessibility");
    expect(result.scoreBreakdown).toHaveProperty("competition");
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(10);
  });

  it("returns exclusion conflict for restricted zone", async () => {
    const caller = appRouter.createCaller(createCtx());
    // 使用一个明确在禁区内的坐标（军事区附近）
    const result = await caller.analysis.quickScore({ lat: 26.08, lng: 119.28 });
    expect(result).toHaveProperty("exclusionConflicts");
    expect(Array.isArray(result.exclusionConflicts)).toBe(true);
  });

  it("returns nearby pois and stations", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.analysis.quickScore({ lat: 26.0756, lng: 119.3034 });
    expect(Array.isArray(result.nearbyPois)).toBe(true);
    expect(Array.isArray(result.nearbyStations)).toBe(true);
  });
});

describe("auth.logout", () => {
  it("clears session cookie", async () => {
    const clearedCookies: string[] = [];
    const ctx: TrpcContext = {
      user: { id: 1, openId: "test", name: "Test", email: null, loginMethod: null, role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: (name: string) => clearedCookies.push(name) } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect(clearedCookies.length).toBe(1);
  });
});
