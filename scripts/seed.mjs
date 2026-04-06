import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// 动态导入schema
const { poiData, trafficFlow, exclusionZones, chargingStations } = await import("../drizzle/schema.js");

console.log("🌱 开始初始化福州市数据...");

// 清空旧数据
await db.delete(poiData);
await db.delete(trafficFlow);
await db.delete(exclusionZones);
await db.delete(chargingStations);

// ── POI数据（42个）──
const pois = [
  // 购物中心
  { name: "万象城（福州）", category: "mall", latitude: 26.0823, longitude: 119.3312, district: "晋安区", address: "福州市晋安区华林路", dailyFlow: 45000, influenceWeight: 2.5, evDemandScore: 9.5 },
  { name: "东百中心", category: "mall", latitude: 26.0762, longitude: 119.3021, district: "鼓楼区", address: "福州市鼓楼区五四路", dailyFlow: 38000, influenceWeight: 2.3, evDemandScore: 9.2 },
  { name: "宝龙广场（仓山）", category: "mall", latitude: 26.0521, longitude: 119.3189, district: "仓山区", address: "福州市仓山区宝龙广场", dailyFlow: 32000, influenceWeight: 2.2, evDemandScore: 8.8 },
  { name: "融侨中心", category: "mall", latitude: 26.0645, longitude: 119.3456, district: "晋安区", address: "福州市晋安区", dailyFlow: 28000, influenceWeight: 2.0, evDemandScore: 8.5 },
  { name: "达道万达广场", category: "mall", latitude: 26.0589, longitude: 119.3234, district: "台江区", address: "福州市台江区达道", dailyFlow: 35000, influenceWeight: 2.2, evDemandScore: 9.0 },
  // 酒店
  { name: "福州香格里拉大酒店", category: "hotel", latitude: 26.0756, longitude: 119.3034, district: "鼓楼区", address: "福州市鼓楼区五四路", dailyFlow: 3000, influenceWeight: 1.8, evDemandScore: 8.5 },
  { name: "福州温德姆至尊豪廷大酒店", category: "hotel", latitude: 26.0712, longitude: 119.3089, district: "台江区", address: "福州市台江区", dailyFlow: 2500, influenceWeight: 1.7, evDemandScore: 8.2 },
  { name: "福州万豪酒店", category: "hotel", latitude: 26.0834, longitude: 119.3278, district: "晋安区", address: "福州市晋安区", dailyFlow: 2800, influenceWeight: 1.8, evDemandScore: 8.3 },
  // 医院
  { name: "福建省立医院", category: "hospital", latitude: 26.0789, longitude: 119.2934, district: "鼓楼区", address: "福州市鼓楼区东街", dailyFlow: 15000, influenceWeight: 2.0, evDemandScore: 8.8 },
  { name: "福州市第一医院", category: "hospital", latitude: 26.0678, longitude: 119.3123, district: "台江区", address: "福州市台江区五一中路", dailyFlow: 12000, influenceWeight: 1.9, evDemandScore: 8.5 },
  { name: "福建医科大学附属协和医院", category: "hospital", latitude: 26.0823, longitude: 119.2912, district: "鼓楼区", address: "福州市鼓楼区新权路", dailyFlow: 18000, influenceWeight: 2.1, evDemandScore: 9.0 },
  // 交通枢纽
  { name: "福州火车站", category: "transport", latitude: 26.0823, longitude: 119.3312, district: "晋安区", address: "福州市晋安区华林路", dailyFlow: 65000, influenceWeight: 3.0, evDemandScore: 9.8 },
  { name: "福州南站", category: "transport", latitude: 25.9812, longitude: 119.2834, district: "仓山区", address: "福州市仓山区", dailyFlow: 85000, influenceWeight: 3.0, evDemandScore: 9.9 },
  { name: "福州长乐国际机场", category: "transport", latitude: 25.9345, longitude: 119.6634, district: "长乐区", address: "福州市长乐区", dailyFlow: 55000, influenceWeight: 2.8, evDemandScore: 9.5 },
  { name: "福州汽车北站", category: "transport", latitude: 26.1023, longitude: 119.3012, district: "晋安区", address: "福州市晋安区", dailyFlow: 25000, influenceWeight: 2.5, evDemandScore: 9.2 },
  // 写字楼/办公区
  { name: "福州软件园", category: "office", latitude: 26.0789, longitude: 119.2812, district: "鼓楼区", address: "福州市鼓楼区软件大道", dailyFlow: 30000, influenceWeight: 2.2, evDemandScore: 9.0 },
  { name: "海峡金融商务区", category: "office", latitude: 26.0756, longitude: 119.3156, district: "台江区", address: "福州市台江区", dailyFlow: 22000, influenceWeight: 2.0, evDemandScore: 8.7 },
  { name: "五四路商务区", category: "office", latitude: 26.0756, longitude: 119.3034, district: "鼓楼区", address: "福州市鼓楼区五四路", dailyFlow: 25000, influenceWeight: 2.1, evDemandScore: 8.8 },
  { name: "福州经济技术开发区", category: "office", latitude: 26.0234, longitude: 119.3789, district: "马尾区", address: "福州市马尾区", dailyFlow: 18000, influenceWeight: 1.9, evDemandScore: 8.3 },
  // 居住区
  { name: "融信澜天（大型居住区）", category: "residential", latitude: 26.0912, longitude: 119.3234, district: "晋安区", address: "福州市晋安区", dailyFlow: 8000, influenceWeight: 1.5, evDemandScore: 7.5 },
  { name: "阳光城翡丽湾", category: "residential", latitude: 26.0634, longitude: 119.3456, district: "晋安区", address: "福州市晋安区", dailyFlow: 6000, influenceWeight: 1.4, evDemandScore: 7.2 },
  { name: "仓山万达住宅区", category: "residential", latitude: 26.0489, longitude: 119.3012, district: "仓山区", address: "福州市仓山区", dailyFlow: 7500, influenceWeight: 1.5, evDemandScore: 7.3 },
  { name: "鼓楼区老城居住区", category: "residential", latitude: 26.0823, longitude: 119.2956, district: "鼓楼区", address: "福州市鼓楼区", dailyFlow: 5000, influenceWeight: 1.3, evDemandScore: 6.8 },
  // 停车场
  { name: "东街口地下停车场", category: "parking", latitude: 26.0789, longitude: 119.3012, district: "鼓楼区", address: "福州市鼓楼区东街口", dailyFlow: 12000, influenceWeight: 1.8, evDemandScore: 8.5 },
  { name: "五一广场地下停车场", category: "parking", latitude: 26.0678, longitude: 119.3089, district: "台江区", address: "福州市台江区五一广场", dailyFlow: 10000, influenceWeight: 1.7, evDemandScore: 8.2 },
  { name: "万象城停车场", category: "parking", latitude: 26.0834, longitude: 119.3289, district: "晋安区", address: "福州市晋安区万象城", dailyFlow: 15000, influenceWeight: 2.0, evDemandScore: 8.8 },
  // 景区
  { name: "三坊七巷", category: "scenic", latitude: 26.0823, longitude: 119.3012, district: "鼓楼区", address: "福州市鼓楼区南后街", dailyFlow: 40000, influenceWeight: 2.0, evDemandScore: 8.0 },
  { name: "西湖公园", category: "scenic", latitude: 26.0912, longitude: 119.2934, district: "鼓楼区", address: "福州市鼓楼区湖滨路", dailyFlow: 20000, influenceWeight: 1.8, evDemandScore: 7.5 },
  { name: "福州国家森林公园", category: "scenic", latitude: 26.1234, longitude: 119.3456, district: "晋安区", address: "福州市晋安区", dailyFlow: 15000, influenceWeight: 1.6, evDemandScore: 7.0 },
  // 政府机构
  { name: "福州市政府", category: "government", latitude: 26.0756, longitude: 119.2934, district: "鼓楼区", address: "福州市鼓楼区华林路", dailyFlow: 5000, influenceWeight: 1.5, evDemandScore: 7.0 },
  { name: "福建省政府", category: "government", latitude: 26.0823, longitude: 119.2878, district: "鼓楼区", address: "福州市鼓楼区", dailyFlow: 4000, influenceWeight: 1.4, evDemandScore: 6.8 },
  // 加油站（潜在改造点）
  { name: "中石化福州五四路加油站", category: "gas_station", latitude: 26.0778, longitude: 119.3045, district: "鼓楼区", address: "福州市鼓楼区五四路", dailyFlow: 800, influenceWeight: 1.2, evDemandScore: 6.0 },
  { name: "中石油福州台江加油站", category: "gas_station", latitude: 26.0645, longitude: 119.3123, district: "台江区", address: "福州市台江区", dailyFlow: 700, influenceWeight: 1.2, evDemandScore: 5.8 },
  // 学校
  { name: "福州大学", category: "school", latitude: 26.0478, longitude: 119.2712, district: "仓山区", address: "福州市仓山区学园路2号", dailyFlow: 25000, influenceWeight: 2.0, evDemandScore: 8.0 },
  { name: "福建师范大学", category: "school", latitude: 26.0823, longitude: 119.2834, district: "鼓楼区", address: "福州市鼓楼区仓山区", dailyFlow: 20000, influenceWeight: 1.9, evDemandScore: 7.8 },
  { name: "福建农林大学", category: "school", latitude: 26.0789, longitude: 119.2456, district: "仓山区", address: "福州市仓山区上下店路15号", dailyFlow: 18000, influenceWeight: 1.8, evDemandScore: 7.5 },
  // 餐饮
  { name: "福州美食街（达明路）", category: "restaurant", latitude: 26.0712, longitude: 119.3067, district: "鼓楼区", address: "福州市鼓楼区达明路", dailyFlow: 20000, influenceWeight: 1.6, evDemandScore: 7.8 },
  { name: "台江夜市美食广场", category: "restaurant", latitude: 26.0623, longitude: 119.3145, district: "台江区", address: "福州市台江区", dailyFlow: 15000, influenceWeight: 1.5, evDemandScore: 7.5 },
  // 补充POI到42个
  { name: "福州奥体中心", category: "scenic", latitude: 26.0234, longitude: 119.3234, district: "仓山区", address: "福州市仓山区", dailyFlow: 25000, influenceWeight: 2.0, evDemandScore: 8.5 },
  { name: "福州海峡奥体中心", category: "scenic", latitude: 26.0189, longitude: 119.3289, district: "仓山区", address: "福州市仓山区", dailyFlow: 18000, influenceWeight: 1.8, evDemandScore: 8.0 },
  { name: "金山万达广场", category: "mall", latitude: 26.0312, longitude: 119.2834, district: "仓山区", address: "福州市仓山区金山大道", dailyFlow: 30000, influenceWeight: 2.2, evDemandScore: 8.8 },
  { name: "福州地铁1号线南门兜站", category: "transport", latitude: 26.0712, longitude: 119.3023, district: "鼓楼区", address: "福州市鼓楼区南门兜", dailyFlow: 35000, influenceWeight: 2.5, evDemandScore: 9.2 },
];

await db.insert(poiData).values(pois);
console.log(`✅ 初始化 ${pois.length} 条POI数据`);

// ── 交通流量数据（21条）──
const roads = [
  { roadName: "绕城高速（西段）", roadLevel: "expressway", startLat: 26.0823, startLng: 119.2234, endLat: 26.0234, endLng: 119.2456, centerLat: 26.0528, centerLng: 119.2345, dailyFlow: 85000, peakFlow: 4200, evRatio: 0.08, heatWeight: 0.95, district: "鼓楼区/仓山区" },
  { roadName: "福州绕城高速（东段）", roadLevel: "expressway", startLat: 26.0823, startLng: 119.3812, endLat: 26.0234, endLng: 119.4012, centerLat: 26.0528, centerLng: 119.3912, dailyFlow: 72000, peakFlow: 3600, evRatio: 0.07, heatWeight: 0.90, district: "晋安区" },
  { roadName: "福厦高速（福州段）", roadLevel: "expressway", startLat: 25.9812, startLng: 119.2834, endLat: 25.9234, endLng: 119.3012, centerLat: 25.9523, centerLng: 119.2923, dailyFlow: 68000, peakFlow: 3400, evRatio: 0.09, heatWeight: 0.92, district: "仓山区" },
  { roadName: "五四路", roadLevel: "arterial", startLat: 26.0756, startLng: 119.2834, endLat: 26.0756, endLng: 119.3234, centerLat: 26.0756, centerLng: 119.3034, dailyFlow: 52000, peakFlow: 2800, evRatio: 0.12, heatWeight: 0.88, district: "鼓楼区" },
  { roadName: "华林路", roadLevel: "arterial", startLat: 26.0823, startLng: 119.2834, endLat: 26.0823, endLng: 119.3312, centerLat: 26.0823, centerLng: 119.3073, dailyFlow: 48000, peakFlow: 2500, evRatio: 0.11, heatWeight: 0.85, district: "鼓楼区/晋安区" },
  { roadName: "五一路", roadLevel: "arterial", startLat: 26.0523, startLng: 119.3012, endLat: 26.0823, endLng: 119.3012, centerLat: 26.0673, centerLng: 119.3012, dailyFlow: 45000, peakFlow: 2300, evRatio: 0.10, heatWeight: 0.83, district: "台江区/鼓楼区" },
  { roadName: "福马路", roadLevel: "arterial", startLat: 26.0523, startLng: 119.3234, endLat: 26.0523, endLng: 119.3812, centerLat: 26.0523, centerLng: 119.3523, dailyFlow: 42000, peakFlow: 2100, evRatio: 0.09, heatWeight: 0.80, district: "晋安区" },
  { roadName: "二环路（北段）", roadLevel: "arterial", startLat: 26.0934, startLng: 119.2834, endLat: 26.0934, endLng: 119.3456, centerLat: 26.0934, centerLng: 119.3145, dailyFlow: 55000, peakFlow: 2900, evRatio: 0.10, heatWeight: 0.87, district: "晋安区/鼓楼区" },
  { roadName: "二环路（南段）", roadLevel: "arterial", startLat: 26.0234, startLng: 119.2834, endLat: 26.0234, endLng: 119.3456, centerLat: 26.0234, centerLng: 119.3145, dailyFlow: 50000, peakFlow: 2600, evRatio: 0.09, heatWeight: 0.85, district: "仓山区" },
  { roadName: "三环路（西段）", roadLevel: "arterial", startLat: 26.0523, startLng: 119.2456, endLat: 26.1023, endLng: 119.2456, centerLat: 26.0773, centerLng: 119.2456, dailyFlow: 62000, peakFlow: 3200, evRatio: 0.08, heatWeight: 0.90, district: "鼓楼区/仓山区" },
  { roadName: "三环路（东段）", roadLevel: "arterial", startLat: 26.0523, startLng: 119.3812, endLat: 26.1023, endLng: 119.3812, centerLat: 26.0773, centerLng: 119.3812, dailyFlow: 58000, peakFlow: 3000, evRatio: 0.08, heatWeight: 0.88, district: "晋安区" },
  { roadName: "东街", roadLevel: "secondary", startLat: 26.0789, startLng: 119.2934, endLat: 26.0789, endLng: 119.3123, centerLat: 26.0789, centerLng: 119.3028, dailyFlow: 28000, peakFlow: 1500, evRatio: 0.13, heatWeight: 0.75, district: "鼓楼区" },
  { roadName: "津泰路", roadLevel: "secondary", startLat: 26.0712, startLng: 119.2934, endLat: 26.0712, endLng: 119.3123, centerLat: 26.0712, centerLng: 119.3028, dailyFlow: 22000, peakFlow: 1200, evRatio: 0.12, heatWeight: 0.70, district: "鼓楼区" },
  { roadName: "六一路", roadLevel: "secondary", startLat: 26.0523, startLng: 119.2834, endLat: 26.0823, endLng: 119.2834, centerLat: 26.0673, centerLng: 119.2834, dailyFlow: 32000, peakFlow: 1700, evRatio: 0.11, heatWeight: 0.78, district: "鼓楼区/仓山区" },
  { roadName: "金山大道", roadLevel: "arterial", startLat: 26.0234, startLng: 119.2456, endLat: 26.0234, endLng: 119.3012, centerLat: 26.0234, centerLng: 119.2734, dailyFlow: 40000, peakFlow: 2100, evRatio: 0.10, heatWeight: 0.82, district: "仓山区" },
  { roadName: "南江滨大道", roadLevel: "arterial", startLat: 26.0234, startLng: 119.2834, endLat: 26.0234, endLng: 119.3456, centerLat: 26.0234, centerLng: 119.3145, dailyFlow: 38000, influenceWeight: 0.80, evRatio: 0.09, heatWeight: 0.80, district: "仓山区", peakFlow: 2000 },
  { roadName: "北江滨大道", roadLevel: "arterial", startLat: 26.0912, startLng: 119.2834, endLat: 26.0912, endLng: 119.3456, centerLat: 26.0912, centerLng: 119.3145, dailyFlow: 42000, peakFlow: 2200, evRatio: 0.10, heatWeight: 0.82, district: "鼓楼区/晋安区" },
  { roadName: "软件大道", roadLevel: "secondary", startLat: 26.0789, startLng: 119.2612, endLat: 26.0789, endLng: 119.2934, centerLat: 26.0789, centerLng: 119.2773, dailyFlow: 25000, peakFlow: 1400, evRatio: 0.15, heatWeight: 0.72, district: "鼓楼区" },
  { roadName: "福飞路", roadLevel: "secondary", startLat: 26.0823, startLng: 119.2834, endLat: 26.1023, endLng: 119.2834, centerLat: 26.0923, centerLng: 119.2834, dailyFlow: 20000, peakFlow: 1100, evRatio: 0.09, heatWeight: 0.68, district: "鼓楼区" },
  { roadName: "台江路", roadLevel: "secondary", startLat: 26.0589, startLng: 119.3012, endLat: 26.0589, endLng: 119.3234, centerLat: 26.0589, centerLng: 119.3123, dailyFlow: 18000, peakFlow: 1000, evRatio: 0.10, heatWeight: 0.65, district: "台江区" },
  { roadName: "长乐路", roadLevel: "branch", startLat: 26.0456, startLng: 119.3123, endLat: 26.0456, endLng: 119.3456, centerLat: 26.0456, centerLng: 119.3289, dailyFlow: 12000, peakFlow: 700, evRatio: 0.08, heatWeight: 0.55, district: "仓山区" },
];

await db.insert(trafficFlow).values(roads);
console.log(`✅ 初始化 ${roads.length} 条交通流量数据`);

// ── 禁止区域（12个）──
const zones = [
  { name: "闽江水域禁区（鼓楼段）", zoneType: "water", centerLat: 26.0634, centerLng: 119.3012, radiusKm: 0.3, description: "闽江河道及两岸防洪堤范围" },
  { name: "闽江水域禁区（台江段）", zoneType: "water", centerLat: 26.0589, centerLng: 119.3234, radiusKm: 0.3, description: "闽江河道及两岸防洪堤范围" },
  { name: "乌龙江水域禁区", zoneType: "water", centerLat: 26.0189, centerLng: 119.2834, radiusKm: 0.4, description: "乌龙江河道保护区" },
  { name: "三坊七巷历史文化保护区", zoneType: "heritage", centerLat: 26.0823, centerLng: 119.3012, radiusKm: 0.5, description: "国家级历史文化街区，禁止工业设施" },
  { name: "西湖公园绿地保护区", zoneType: "park", centerLat: 26.0912, centerLng: 119.2934, radiusKm: 0.4, description: "城市公园绿地，禁止商业设施" },
  { name: "福州国家森林公园核心区", zoneType: "park", centerLat: 26.1234, centerLng: 119.3456, radiusKm: 0.8, description: "国家级森林公园保护区" },
  { name: "福建省政府安保区", zoneType: "government", centerLat: 26.0823, centerLng: 119.2878, radiusKm: 0.3, description: "省政府安保范围" },
  { name: "福州军事禁区（北郊）", zoneType: "military", centerLat: 26.1234, centerLng: 119.2834, radiusKm: 1.0, description: "军事用地，严禁民用设施" },
  { name: "福州机场净空保护区", zoneType: "airport", centerLat: 25.9345, centerLng: 119.6634, radiusKm: 2.0, description: "机场净空保护范围" },
  { name: "晋安河水系保护区", zoneType: "water", centerLat: 26.0823, centerLng: 119.3456, radiusKm: 0.2, description: "晋安河城市内河保护区" },
  { name: "光明港水系保护区", zoneType: "water", centerLat: 26.0634, centerLng: 119.3567, radiusKm: 0.2, description: "光明港内河保护区" },
  { name: "鼓山风景名胜区", zoneType: "scenic", centerLat: 26.0934, centerLng: 119.3789, radiusKm: 1.5, description: "国家级风景名胜区" },
];

await db.insert(exclusionZones).values(zones);
console.log(`✅ 初始化 ${zones.length} 条禁止区域数据`);

// ── 充电站（6个）──
const stations = [
  { name: "特来电福州万象城充电站", latitude: 26.0823, longitude: 119.3312, district: "晋安区", connectors: 20, power: 120.0, operator: "特来电" },
  { name: "国家电网福州南站充电站", latitude: 25.9812, longitude: 119.2834, district: "仓山区", connectors: 30, power: 150.0, operator: "国家电网" },
  { name: "星星充电福州软件园站", latitude: 26.0789, longitude: 119.2812, district: "鼓楼区", connectors: 12, power: 60.0, operator: "星星充电" },
  { name: "特来电福州东百中心站", latitude: 26.0762, longitude: 119.3021, district: "鼓楼区", connectors: 8, power: 60.0, operator: "特来电" },
  { name: "国家电网福州火车站充电站", latitude: 26.0823, longitude: 119.3312, district: "晋安区", connectors: 16, power: 120.0, operator: "国家电网" },
  { name: "云快充福州金山广场站", latitude: 26.0312, longitude: 119.2834, district: "仓山区", connectors: 10, power: 60.0, operator: "云快充" },
];

await db.insert(chargingStations).values(stations);
console.log(`✅ 初始化 ${stations.length} 条充电站数据`);

console.log("🎉 数据初始化完成！");
await connection.end();
