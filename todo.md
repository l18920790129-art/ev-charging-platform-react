# 福州新能源充电桩智能选址平台 TODO

## 后端 API 层
- [x] 数据库Schema：poiData, trafficFlow, exclusionZones, chargingStations, analysisHistory, reportHistory, memorySessions
- [x] 数据库迁移并初始化种子数据（42 POI、21 道路、12 禁区、6 充电站）
- [x] tRPC路由：maps.getDashboardStats, maps.getPOI, maps.getTrafficFlow, maps.getExclusionZones, maps.getChargingStations
- [x] tRPC路由：analysis.quickScore（10分制综合评分）, analysis.aiAnalysis, analysis.getHistory
- [x] tRPC路由：reports.generate, reports.list
- [x] tRPC路由：memory.getSessions, memory.clearSession

## 前端页面
- [x] 全局深色科技风主题（index.css）
- [x] 侧边栏导航组件（Sidebar.tsx）
- [x] 数据大屏（Dashboard.tsx）- KPI卡片 + ECharts图表 + POI排行榜
- [x] 地图选址（MapAnalysis.tsx）- 高德地图 + 图层控制 + 点击评分
- [x] 热力图分析（HeatMap.tsx）- 交通流量/新能源车热力图
- [x] AI智能分析（AIAnalysis.tsx）- 对话式选址咨询
- [x] 知识图谱（KnowledgeGraph.tsx）- ECharts力导向图
- [x] 选址报告（Reports.tsx）- AI生成 + 下载
- [x] 历史记忆（History.tsx）- 对话/报告历史管理

## 技术集成
- [x] 高德地图API Key配置（VITE_AMAP_KEY / VITE_AMAP_SECURITY_CODE）
- [x] ECharts集成
- [x] 高德地图JS SDK动态加载
- [x] AI分析（调用内置LLM invokeLLM）

## 测试
- [x] Vitest：11/11 全部通过
- [x] 覆盖：getDashboardStats、getPOI、getTrafficFlow、getExclusionZones、getChargingStations、quickScore、auth.logout

## Bug修复 - 数据显示为0

- [ ] 诊断API数据加载失败根因
- [ ] 修复数据库种子脚本确保数据写入成功
- [ ] 修复热力图页面数据加载（道路流量数据）
- [ ] 修复数据大屏统计数据显示
- [ ] 修复AI分析页面数据
- [ ] 推送修复到GitHub/Render
