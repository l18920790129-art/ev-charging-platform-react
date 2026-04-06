import { int, float, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const poiData = mysqlTable("poi_data", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  latitude: float("latitude").notNull(),
  longitude: float("longitude").notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  address: text("address"),
  dailyFlow: int("daily_flow").default(0).notNull(),
  influenceWeight: float("influence_weight").default(1.0).notNull(),
  evDemandScore: float("ev_demand_score").default(5.0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const trafficFlow = mysqlTable("traffic_flow", {
  id: int("id").autoincrement().primaryKey(),
  roadName: varchar("road_name", { length: 200 }).notNull(),
  roadLevel: varchar("road_level", { length: 50 }).notNull(),
  startLat: float("start_lat").notNull(),
  startLng: float("start_lng").notNull(),
  endLat: float("end_lat").notNull(),
  endLng: float("end_lng").notNull(),
  centerLat: float("center_lat").notNull(),
  centerLng: float("center_lng").notNull(),
  dailyFlow: int("daily_flow").default(0).notNull(),
  peakFlow: int("peak_flow").default(0).notNull(),
  evRatio: float("ev_ratio").default(0.05).notNull(),
  heatWeight: float("heat_weight").default(1.0).notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const exclusionZones = mysqlTable("exclusion_zones", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  zoneType: varchar("zone_type", { length: 50 }).notNull(),
  centerLat: float("center_lat").notNull(),
  centerLng: float("center_lng").notNull(),
  radiusKm: float("radius_km").default(0.5).notNull(),
  boundaryJson: text("boundary_json"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const chargingStations = mysqlTable("charging_stations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  latitude: float("latitude").notNull(),
  longitude: float("longitude").notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  connectors: int("connectors").default(4).notNull(),
  power: float("power").default(60.0).notNull(),
  operator: varchar("operator", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const analysisHistory = mysqlTable("analysis_history", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  lat: float("lat").notNull(),
  lng: float("lng").notNull(),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  totalScore: float("total_score").default(0),
  scoreBreakdown: text("score_breakdown"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const reportHistory = mysqlTable("report_history", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  address: varchar("address", { length: 300 }).notNull(),
  lat: float("lat").notNull(),
  lng: float("lng").notNull(),
  totalScore: float("total_score").default(0),
  reportContent: text("report_content").notNull(),
  scoreBreakdown: text("score_breakdown"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const memorySessions = mysqlTable("memory_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 200 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
