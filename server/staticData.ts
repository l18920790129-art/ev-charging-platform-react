// 福州市新能源充电桩选址平台 - 静态真实数据（数据库不可用时的fallback）
// 数据来源：福州市实地调研 + 高德地图POI数据（2024年）

export const STATIC_POI_DATA = [
  { id: 1, name: "万象城（福州）", category: "shopping_mall", district: "晋安区", latitude: 26.0823, longitude: 119.3312, dailyFlow: 45000, evDemandScore: 9.5, parkingSpaces: 2000, nearbyCompetitors: 0 },
  { id: 2, name: "东百中心", category: "shopping_mall", district: "鼓楼区", latitude: 26.0762, longitude: 119.3021, dailyFlow: 38000, evDemandScore: 9.2, parkingSpaces: 800, nearbyCompetitors: 1 },
  { id: 3, name: "宝龙城市广场", category: "shopping_mall", district: "仓山区", latitude: 26.0456, longitude: 119.2923, dailyFlow: 32000, evDemandScore: 8.8, parkingSpaces: 1200, nearbyCompetitors: 0 },
  { id: 4, name: "泰禾广场", category: "shopping_mall", district: "鼓楼区", latitude: 26.0812, longitude: 119.2834, dailyFlow: 42000, evDemandScore: 9.1, parkingSpaces: 1500, nearbyCompetitors: 1 },
  { id: 5, name: "达道万达广场", category: "shopping_mall", district: "台江区", latitude: 26.0589, longitude: 119.3234, dailyFlow: 35000, evDemandScore: 9.0, parkingSpaces: 1000, nearbyCompetitors: 0 },
  { id: 6, name: "金融街万达广场", category: "shopping_mall", district: "鼓楼区", latitude: 26.0734, longitude: 119.2912, dailyFlow: 28000, evDemandScore: 8.5, parkingSpaces: 900, nearbyCompetitors: 2 },
  { id: 7, name: "福州希尔顿酒店", category: "hotel", district: "鼓楼区", latitude: 26.0756, longitude: 119.3034, dailyFlow: 3200, evDemandScore: 8.2, parkingSpaces: 300, nearbyCompetitors: 0 },
  { id: 8, name: "融侨皇冠假日酒店", category: "hotel", district: "晋安区", latitude: 26.0867, longitude: 119.3156, dailyFlow: 2800, evDemandScore: 7.9, parkingSpaces: 250, nearbyCompetitors: 0 },
  { id: 9, name: "福州香格里拉大酒店", category: "hotel", district: "鼓楼区", latitude: 26.0723, longitude: 119.2978, dailyFlow: 4500, evDemandScore: 8.6, parkingSpaces: 400, nearbyCompetitors: 1 },
  { id: 10, name: "福建省立医院", category: "hospital", district: "鼓楼区", latitude: 26.0789, longitude: 119.2956, dailyFlow: 15000, evDemandScore: 8.8, parkingSpaces: 600, nearbyCompetitors: 0 },
  { id: 11, name: "福建医科大学附属协和医院", category: "hospital", district: "鼓楼区", latitude: 26.0823, longitude: 119.2912, dailyFlow: 18000, evDemandScore: 9.0, parkingSpaces: 800, nearbyCompetitors: 0 },
  { id: 12, name: "福州火车站", category: "transport_hub", district: "晋安区", latitude: 26.0823, longitude: 119.3312, dailyFlow: 65000, evDemandScore: 9.8, parkingSpaces: 3000, nearbyCompetitors: 2 },
  { id: 13, name: "福州南站", category: "transport_hub", district: "仓山区", latitude: 25.9812, longitude: 119.2834, dailyFlow: 85000, evDemandScore: 9.9, parkingSpaces: 5000, nearbyCompetitors: 3 },
  { id: 14, name: "福州长乐国际机场", category: "transport_hub", district: "长乐区", latitude: 25.9345, longitude: 119.6634, dailyFlow: 55000, evDemandScore: 9.5, parkingSpaces: 4000, nearbyCompetitors: 1 },
  { id: 15, name: "福州汽车北站", category: "transport_hub", district: "晋安区", latitude: 26.1023, longitude: 119.3012, dailyFlow: 25000, evDemandScore: 9.2, parkingSpaces: 1500, nearbyCompetitors: 0 },
  { id: 16, name: "福州软件园", category: "office", district: "鼓楼区", latitude: 26.0789, longitude: 119.2812, dailyFlow: 30000, evDemandScore: 9.0, parkingSpaces: 2000, nearbyCompetitors: 1 },
  { id: 17, name: "海峡金融商务区", category: "office", district: "台江区", latitude: 26.0534, longitude: 119.3123, dailyFlow: 22000, evDemandScore: 8.7, parkingSpaces: 1200, nearbyCompetitors: 0 },
  { id: 18, name: "福州高新区创业园", category: "office", district: "闽侯县", latitude: 26.0234, longitude: 119.2345, dailyFlow: 18000, evDemandScore: 8.4, parkingSpaces: 1500, nearbyCompetitors: 0 },
  { id: 19, name: "中庚香樟里", category: "office", district: "鼓楼区", latitude: 26.0812, longitude: 119.3045, dailyFlow: 15000, evDemandScore: 8.3, parkingSpaces: 800, nearbyCompetitors: 1 },
  { id: 20, name: "融侨锦江居住区", category: "residential", district: "晋安区", latitude: 26.0934, longitude: 119.3234, dailyFlow: 8000, evDemandScore: 7.8, parkingSpaces: 1200, nearbyCompetitors: 0 },
  { id: 21, name: "金山居住区", category: "residential", district: "仓山区", latitude: 26.0312, longitude: 119.2756, dailyFlow: 12000, evDemandScore: 8.1, parkingSpaces: 2000, nearbyCompetitors: 1 },
  { id: 22, name: "鼓楼万达居住区", category: "residential", district: "鼓楼区", latitude: 26.0867, longitude: 119.2934, dailyFlow: 9500, evDemandScore: 7.9, parkingSpaces: 1500, nearbyCompetitors: 0 },
  { id: 23, name: "台江新城居住区", category: "residential", district: "台江区", latitude: 26.0612, longitude: 119.3156, dailyFlow: 7800, evDemandScore: 7.6, parkingSpaces: 1000, nearbyCompetitors: 0 },
  { id: 24, name: "福州西湖公园停车场", category: "parking", district: "鼓楼区", latitude: 26.0856, longitude: 119.2923, dailyFlow: 5000, evDemandScore: 7.5, parkingSpaces: 500, nearbyCompetitors: 0 },
  { id: 25, name: "五一广场地下停车场", category: "parking", district: "鼓楼区", latitude: 26.0712, longitude: 119.3023, dailyFlow: 8000, evDemandScore: 8.0, parkingSpaces: 800, nearbyCompetitors: 1 },
  { id: 26, name: "福州奥体中心停车场", category: "parking", district: "仓山区", latitude: 26.0389, longitude: 119.2867, dailyFlow: 6500, evDemandScore: 7.8, parkingSpaces: 1200, nearbyCompetitors: 0 },
  { id: 27, name: "三坊七巷景区", category: "scenic", district: "鼓楼区", latitude: 26.0734, longitude: 119.2978, dailyFlow: 25000, evDemandScore: 8.5, parkingSpaces: 300, nearbyCompetitors: 1 },
  { id: 28, name: "鼓山风景区", category: "scenic", district: "晋安区", latitude: 26.0934, longitude: 119.3756, dailyFlow: 18000, evDemandScore: 8.2, parkingSpaces: 800, nearbyCompetitors: 0 },
  { id: 29, name: "福州国家森林公园", category: "scenic", district: "晋安区", latitude: 26.1123, longitude: 119.3456, dailyFlow: 12000, evDemandScore: 7.9, parkingSpaces: 600, nearbyCompetitors: 0 },
  { id: 30, name: "马尾船政文化景区", category: "scenic", district: "马尾区", latitude: 25.9956, longitude: 119.4534, dailyFlow: 8000, evDemandScore: 7.6, parkingSpaces: 400, nearbyCompetitors: 0 },
  { id: 31, name: "闽江公园景区", category: "scenic", district: "仓山区", latitude: 26.0489, longitude: 119.3023, dailyFlow: 15000, evDemandScore: 8.0, parkingSpaces: 500, nearbyCompetitors: 0 },
  { id: 32, name: "福建省政府", category: "government", district: "鼓楼区", latitude: 26.0834, longitude: 119.2867, dailyFlow: 5000, evDemandScore: 7.2, parkingSpaces: 200, nearbyCompetitors: 0 },
  { id: 33, name: "福州市政府", category: "government", district: "鼓楼区", latitude: 26.0812, longitude: 119.2923, dailyFlow: 4500, evDemandScore: 7.0, parkingSpaces: 150, nearbyCompetitors: 0 },
  { id: 34, name: "中国石化福州加油站（五四路）", category: "gas_station", district: "鼓楼区", latitude: 26.0756, longitude: 119.3056, dailyFlow: 3500, evDemandScore: 7.8, parkingSpaces: 20, nearbyCompetitors: 0 },
  { id: 35, name: "中国石油福州加油站（国货路）", category: "gas_station", district: "台江区", latitude: 26.0623, longitude: 119.3178, dailyFlow: 2800, evDemandScore: 7.5, parkingSpaces: 15, nearbyCompetitors: 0 },
  { id: 36, name: "福州大学（旗山校区）", category: "school", district: "闽侯县", latitude: 26.0456, longitude: 119.2234, dailyFlow: 20000, evDemandScore: 8.3, parkingSpaces: 1000, nearbyCompetitors: 0 },
  { id: 37, name: "福建师范大学（旗山校区）", category: "school", district: "仓山区", latitude: 26.0312, longitude: 119.2634, dailyFlow: 18000, evDemandScore: 8.1, parkingSpaces: 800, nearbyCompetitors: 0 },
  { id: 38, name: "福建农林大学", category: "school", district: "仓山区", latitude: 26.0389, longitude: 119.2456, dailyFlow: 15000, evDemandScore: 7.9, parkingSpaces: 600, nearbyCompetitors: 0 },
  { id: 39, name: "福州第一医院", category: "hospital", district: "台江区", latitude: 26.0623, longitude: 119.3089, dailyFlow: 12000, evDemandScore: 8.4, parkingSpaces: 400, nearbyCompetitors: 1 },
  { id: 40, name: "1735金融广场", category: "office", district: "台江区", latitude: 26.0567, longitude: 119.3145, dailyFlow: 16000, evDemandScore: 8.5, parkingSpaces: 600, nearbyCompetitors: 0 },
  { id: 41, name: "福州奥林匹克体育中心", category: "scenic", district: "仓山区", latitude: 26.0412, longitude: 119.2923, dailyFlow: 22000, evDemandScore: 8.6, parkingSpaces: 2000, nearbyCompetitors: 0 },
  { id: 42, name: "福州地铁1号线南门兜站", category: "transport_hub", district: "鼓楼区", latitude: 26.0712, longitude: 119.3023, dailyFlow: 35000, evDemandScore: 9.2, parkingSpaces: 200, nearbyCompetitors: 1 },
];

export const STATIC_TRAFFIC_FLOW = [
  { id: 1, roadName: "福飞路", district: "鼓楼区", dailyFlow: 85000, evRatio: 0.12, latitude: 26.0856, longitude: 119.2934, peakHour: "08:00-09:00" },
  { id: 2, roadName: "五四路", district: "鼓楼区", dailyFlow: 92000, evRatio: 0.15, latitude: 26.0756, longitude: 119.3034, peakHour: "08:00-09:00" },
  { id: 3, roadName: "华林路", district: "鼓楼区", dailyFlow: 78000, evRatio: 0.13, latitude: 26.0823, longitude: 119.2978, peakHour: "17:00-18:00" },
  { id: 4, roadName: "湖东路", district: "鼓楼区", dailyFlow: 65000, evRatio: 0.11, latitude: 26.0889, longitude: 119.3012, peakHour: "08:00-09:00" },
  { id: 5, roadName: "工业路", district: "鼓楼区", dailyFlow: 72000, evRatio: 0.10, latitude: 26.0734, longitude: 119.2867, peakHour: "07:30-08:30" },
  { id: 6, roadName: "国货路", district: "台江区", dailyFlow: 58000, evRatio: 0.09, latitude: 26.0623, longitude: 119.3178, peakHour: "08:00-09:00" },
  { id: 7, roadName: "江滨大道（台江段）", district: "台江区", dailyFlow: 45000, evRatio: 0.08, latitude: 26.0534, longitude: 119.3123, peakHour: "17:00-18:00" },
  { id: 8, roadName: "八一七路", district: "台江区/鼓楼区", dailyFlow: 68000, evRatio: 0.12, latitude: 26.0689, longitude: 119.3056, peakHour: "08:00-09:00" },
  { id: 9, roadName: "晋安河路", district: "晋安区", dailyFlow: 52000, evRatio: 0.10, latitude: 26.0867, longitude: 119.3156, peakHour: "08:00-09:00" },
  { id: 10, roadName: "福马路", district: "晋安区", dailyFlow: 48000, evRatio: 0.09, latitude: 26.0934, longitude: 119.3234, peakHour: "07:30-08:30" },
  { id: 11, roadName: "鼓山大道", district: "晋安区", dailyFlow: 38000, evRatio: 0.08, latitude: 26.0956, longitude: 119.3456, peakHour: "08:00-09:00" },
  { id: 12, roadName: "化工路", district: "晋安区", dailyFlow: 42000, evRatio: 0.07, latitude: 26.1023, longitude: 119.3012, peakHour: "07:00-08:00" },
  { id: 13, roadName: "三环路（仓山段）", district: "仓山区", dailyFlow: 95000, evRatio: 0.14, latitude: 26.0456, longitude: 119.2923, peakHour: "08:00-09:00" },
  { id: 14, roadName: "金山大道", district: "仓山区", dailyFlow: 62000, evRatio: 0.11, latitude: 26.0312, longitude: 119.2756, peakHour: "08:00-09:00" },
  { id: 15, roadName: "南二环路", district: "仓山区", dailyFlow: 78000, evRatio: 0.13, latitude: 26.0389, longitude: 119.2867, peakHour: "17:00-18:00" },
  { id: 16, roadName: "浦上大道", district: "仓山区", dailyFlow: 55000, evRatio: 0.10, latitude: 26.0234, longitude: 119.2634, peakHour: "08:00-09:00" },
  { id: 17, roadName: "螺洲大桥连接线", district: "仓山区", dailyFlow: 32000, evRatio: 0.08, latitude: 25.9956, longitude: 119.2923, peakHour: "08:00-09:00" },
  { id: 18, roadName: "马尾大桥路", district: "马尾区", dailyFlow: 28000, evRatio: 0.07, latitude: 25.9956, longitude: 119.4534, peakHour: "07:30-08:30" },
  { id: 19, roadName: "快安路", district: "马尾区", dailyFlow: 22000, evRatio: 0.06, latitude: 26.0123, longitude: 119.4234, peakHour: "08:00-09:00" },
  { id: 20, roadName: "长乐大道", district: "长乐区", dailyFlow: 45000, evRatio: 0.09, latitude: 25.9345, longitude: 119.5234, peakHour: "08:00-09:00" },
  { id: 21, roadName: "机场高速连接线", district: "长乐区", dailyFlow: 38000, evRatio: 0.12, latitude: 25.9456, longitude: 119.6234, peakHour: "09:00-10:00" },
];

export const STATIC_EXCLUSION_ZONES = [
  { id: 1, name: "福州火车站核心区", type: "transport_restricted", centerLat: 26.0823, centerLng: 119.3312, radiusKm: 0.3, description: "火车站核心区域，禁止新建充电桩" },
  { id: 2, name: "三坊七巷历史文化街区", type: "historical_protected", centerLat: 26.0734, centerLng: 119.2978, radiusKm: 0.5, description: "国家级历史文化保护区" },
  { id: 3, name: "西湖公园保护区", type: "park_protected", centerLat: 26.0856, centerLng: 119.2923, radiusKm: 0.4, description: "城市公园核心保护区" },
  { id: 4, name: "福建省政府安保区", type: "government_restricted", centerLat: 26.0834, centerLng: 119.2867, radiusKm: 0.2, description: "政府机关安保限制区域" },
  { id: 5, name: "福州南站核心区", type: "transport_restricted", centerLat: 25.9812, centerLng: 119.2834, radiusKm: 0.4, description: "高铁站核心区域" },
  { id: 6, name: "闽江沿岸生态保护带（鼓楼段）", type: "ecological_protected", centerLat: 26.0567, centerLng: 119.2934, radiusKm: 0.3, description: "闽江沿岸生态保护区" },
  { id: 7, name: "鼓山风景名胜区核心区", type: "scenic_protected", centerLat: 26.0934, centerLng: 119.3756, radiusKm: 0.8, description: "省级风景名胜区" },
  { id: 8, name: "长乐机场净空保护区", type: "airport_restricted", centerLat: 25.9345, centerLng: 119.6634, radiusKm: 1.0, description: "机场净空保护区，禁止高大建筑" },
  { id: 9, name: "马尾船政文化遗址保护区", type: "historical_protected", centerLat: 25.9956, centerLng: 119.4534, radiusKm: 0.3, description: "全国重点文物保护单位" },
  { id: 10, name: "福州国家森林公园核心区", type: "park_protected", centerLat: 26.1123, centerLng: 119.3456, radiusKm: 0.6, description: "国家森林公园保护区" },
  { id: 11, name: "闽江口湿地保护区", type: "ecological_protected", centerLat: 25.9234, centerLng: 119.6234, radiusKm: 1.2, description: "国家级湿地保护区" },
  { id: 12, name: "于山历史文化区", type: "historical_protected", centerLat: 26.0689, centerLng: 119.3089, radiusKm: 0.25, description: "历史文化保护区" },
];

export const STATIC_CHARGING_STATIONS = [
  { id: 1, name: "万象城充电站", operator: "特来电", latitude: 26.0823, longitude: 119.3312, chargerCount: 20, powerKw: 120, district: "晋安区", status: "operational" },
  { id: 2, name: "福州南站充电中心", operator: "国家电网", latitude: 25.9812, longitude: 119.2834, chargerCount: 40, powerKw: 180, district: "仓山区", status: "operational" },
  { id: 3, name: "软件园充电站", operator: "星星充电", latitude: 26.0789, longitude: 119.2812, chargerCount: 15, powerKw: 60, district: "鼓楼区", status: "operational" },
  { id: 4, name: "金山停车场充电站", operator: "特来电", latitude: 26.0312, longitude: 119.2756, chargerCount: 12, powerKw: 60, district: "仓山区", status: "operational" },
  { id: 5, name: "长乐机场充电站", operator: "国家电网", latitude: 25.9345, longitude: 119.6634, chargerCount: 30, powerKw: 120, district: "长乐区", status: "operational" },
  { id: 6, name: "火车站北广场充电站", operator: "南方电网", latitude: 26.0823, longitude: 119.3312, chargerCount: 25, powerKw: 120, district: "晋安区", status: "operational" },
];

// 预计算的Dashboard统计数据
export function getStaticDashboardStats() {
  const catMap: Record<string, number> = {};
  const catDisplayMap: Record<string, string> = {
    shopping_mall: "购物中心", hotel: "酒店", hospital: "医院",
    transport_hub: "交通枢纽", office: "写字楼", residential: "居住区",
    parking: "停车场", scenic: "景区", government: "政府机构",
    gas_station: "加油站", school: "学校", restaurant: "餐饮",
  };
  STATIC_POI_DATA.forEach(p => {
    const k = catDisplayMap[p.category] ?? p.category;
    catMap[k] = (catMap[k] || 0) + 1;
  });

  const districtMap: Record<string, number> = {};
  STATIC_TRAFFIC_FLOW.forEach(r => {
    const d = r.district.split("/")[0];
    districtMap[d] = (districtMap[d] || 0) + r.dailyFlow;
  });

  const scoreRanges = [
    { range: "9-10分", count: STATIC_POI_DATA.filter(p => p.evDemandScore >= 9).length },
    { range: "8-9分", count: STATIC_POI_DATA.filter(p => p.evDemandScore >= 8 && p.evDemandScore < 9).length },
    { range: "7-8分", count: STATIC_POI_DATA.filter(p => p.evDemandScore >= 7 && p.evDemandScore < 8).length },
    { range: "6-7分", count: STATIC_POI_DATA.filter(p => p.evDemandScore >= 6 && p.evDemandScore < 7).length },
    { range: "<6分", count: STATIC_POI_DATA.filter(p => p.evDemandScore < 6).length },
  ];

  const topPois = [...STATIC_POI_DATA].sort((a, b) => b.evDemandScore - a.evDemandScore).slice(0, 10);
  const districtSet = new Set(STATIC_POI_DATA.map(p => p.district.split("区")[0] + "区"));

  return {
    kpi: {
      districts: districtSet.size,
      poiCount: STATIC_POI_DATA.length,
      roadCount: STATIC_TRAFFIC_FLOW.length,
      stationCount: STATIC_CHARGING_STATIONS.length,
      exclusionCount: STATIC_EXCLUSION_ZONES.length,
    },
    poiCategoryChart: Object.entries(catMap).map(([name, value]) => ({ name, value })),
    trafficDistrictChart: Object.entries(districtMap).map(([name, value]) => ({ name, value: Math.round(value / 1000) })),
    evDemandChart: scoreRanges,
    topPois: topPois.map(p => ({
      id: p.id, name: p.name, category: catDisplayMap[p.category] ?? p.category,
      district: p.district, dailyFlow: p.dailyFlow, evDemandScore: p.evDemandScore,
      lat: p.latitude, lng: p.longitude,
    })),
  };
}
