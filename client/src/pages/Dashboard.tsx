import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { MapPin, Route, Zap, Ban, Building2, TrendingUp } from "lucide-react";
import * as echarts from "echarts";
import { useLocation } from "wouter";

function KpiCard({ icon: Icon, label, value, color, sub }: {
  icon: React.ElementType; label: string; value: number | string; color: string; sub?: string;
}) {
  return (
    <div className="tech-card p-5 flex items-center gap-4">
      <div
        className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        {sub && <div className="text-xs text-muted-foreground opacity-60 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function PieChart({ data, title }: { data: { name: string; value: number }[]; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !data.length) return;
    const chart = echarts.init(ref.current, "dark");
    chart.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: {
        orient: "vertical", right: "5%", top: "center",
        textStyle: { color: "oklch(0.65 0.02 240)", fontSize: 11 },
        icon: "circle", itemWidth: 8, itemHeight: 8,
      },
      series: [{
        name: title, type: "pie",
        radius: ["45%", "72%"],
        center: ["38%", "50%"],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 13, fontWeight: "bold" } },
        data: data.map((d, i) => ({
          ...d,
          itemStyle: {
            color: [
              "oklch(0.62 0.22 200)", "oklch(0.52 0.24 170)", "oklch(0.68 0.20 280)",
              "oklch(0.75 0.18 60)", "oklch(0.62 0.22 25)", "oklch(0.72 0.20 145)",
              "oklch(0.65 0.18 320)", "oklch(0.70 0.15 100)",
            ][i % 8],
          },
        })),
      }],
    });
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => { chart.dispose(); ro.disconnect(); };
  }, [data, title]);
  return <div ref={ref} className="w-full h-full" />;
}

function BarChart({ data, title, unit }: { data: { name: string; value: number }[]; title: string; unit?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !data.length) return;
    const chart = echarts.init(ref.current, "dark");
    chart.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis", formatter: (p: any) => `${p[0].name}: ${p[0].value}${unit ?? ""}` },
      grid: { left: "3%", right: "4%", bottom: "3%", top: "8%", containLabel: true },
      xAxis: {
        type: "category",
        data: data.map(d => d.name),
        axisLabel: { color: "oklch(0.55 0.02 240)", fontSize: 10, rotate: data.length > 5 ? 30 : 0 },
        axisLine: { lineStyle: { color: "oklch(0.25 0.03 240)" } },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "oklch(0.55 0.02 240)", fontSize: 10 },
        splitLine: { lineStyle: { color: "oklch(0.18 0.025 240)" } },
      },
      series: [{
        type: "bar", data: data.map(d => d.value),
        barMaxWidth: 36,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "oklch(0.72 0.18 200)" },
            { offset: 1, color: "oklch(0.52 0.24 170)" },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      }],
    });
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => { chart.dispose(); ro.disconnect(); };
  }, [data, title, unit]);
  return <div ref={ref} className="w-full h-full" />;
}

function ScoreDistChart({ data }: { data: { range: string; count: number }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !data.length) return;
    const chart = echarts.init(ref.current, "dark");
    chart.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      grid: { left: "3%", right: "4%", bottom: "3%", top: "8%", containLabel: true },
      xAxis: {
        type: "category",
        data: data.map(d => d.range),
        axisLabel: { color: "oklch(0.55 0.02 240)", fontSize: 10 },
        axisLine: { lineStyle: { color: "oklch(0.25 0.03 240)" } },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "oklch(0.55 0.02 240)", fontSize: 10 },
        splitLine: { lineStyle: { color: "oklch(0.18 0.025 240)" } },
      },
      series: [{
        type: "bar", data: data.map(d => d.count),
        barMaxWidth: 40,
        itemStyle: {
          color: (params: any) => {
            const colors = [
              "oklch(0.72 0.20 145)", "oklch(0.72 0.18 200)",
              "oklch(0.80 0.18 60)", "oklch(0.65 0.22 25)", "oklch(0.50 0.02 240)",
            ];
            return colors[params.dataIndex] ?? colors[0];
          },
          borderRadius: [4, 4, 0, 0],
        },
      }],
    });
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => { chart.dispose(); ro.disconnect(); };
  }, [data]);
  return <div ref={ref} className="w-full h-full" />;
}

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.maps.getDashboardStats.useQuery();
  const [, navigate] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div className="text-muted-foreground text-sm">加载数据中...</div>
        </div>
      </div>
    );
  }

  const kpi = stats?.kpi;

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">数据大屏</h1>
          <p className="text-sm text-muted-foreground mt-0.5">福州市新能源充电桩选址数据总览</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="pulse-dot" />
          <span>实时数据</span>
        </div>
      </div>

      {/* KPI卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard icon={Building2} label="覆盖行政区" value={kpi?.districts ?? 0} color="oklch(0.62 0.22 200)" sub="个区县" />
        <KpiCard icon={MapPin} label="POI分析点位" value={kpi?.poiCount ?? 0} color="oklch(0.52 0.24 170)" sub="个兴趣点" />
        <KpiCard icon={Route} label="主干道监控" value={kpi?.roadCount ?? 0} color="oklch(0.68 0.20 280)" sub="条道路" />
        <KpiCard icon={Zap} label="现有充电站" value={kpi?.stationCount ?? 0} color="oklch(0.75 0.18 60)" sub="个站点" />
        <KpiCard icon={Ban} label="禁止区域" value={kpi?.exclusionCount ?? 0} color="oklch(0.62 0.22 25)" sub="个禁区" />
      </div>

      {/* 图表区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="tech-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">POI类别分布</h3>
            <span className="text-xs text-muted-foreground">{kpi?.poiCount ?? 0} 个点位</span>
          </div>
          <div className="h-52">
            <PieChart data={stats?.poiCategoryChart ?? []} title="POI类别" />
          </div>
        </div>

        <div className="tech-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">各区域交通流量</h3>
            <span className="text-xs text-muted-foreground">千辆/日</span>
          </div>
          <div className="h-52">
            <BarChart data={stats?.trafficDistrictChart ?? []} title="交通流量" unit="k辆" />
          </div>
        </div>

        <div className="tech-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">充电需求评分分布</h3>
            <span className="text-xs text-muted-foreground">POI需求评分</span>
          </div>
          <div className="h-52">
            <ScoreDistChart data={stats?.evDemandChart ?? []} />
          </div>
        </div>
      </div>

      {/* 高需求POI排行榜 */}
      <div className="tech-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">高需求POI排行榜</h3>
          </div>
          <button
            onClick={() => navigate("/map")}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            查看地图 →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "oklch(0.22 0.028 240)" }}>
                {["排名", "POI名称", "类别", "所属区域", "日均人流", "需求评分", "操作"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(stats?.topPois ?? []).map((poi, i) => (
                <tr
                  key={poi.id}
                  className="border-b hover:bg-secondary/30 transition-colors"
                  style={{ borderColor: "oklch(0.18 0.022 240)" }}
                >
                  <td className="py-2.5 px-3">
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold"
                      style={{
                        background: i < 3 ? "oklch(0.62 0.22 200 / 0.2)" : "oklch(0.20 0.028 240)",
                        color: i < 3 ? "oklch(0.72 0.18 200)" : "oklch(0.55 0.02 240)",
                      }}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-foreground">{poi.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "oklch(0.20 0.028 240)", color: "oklch(0.65 0.02 240)" }}>
                      {poi.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">{poi.district}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{poi.dailyFlow.toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="score-bar w-16">
                        <div className="score-bar-fill" style={{ width: `${poi.evDemandScore * 10}%` }} />
                      </div>
                      <span className={`font-semibold ${poi.evDemandScore >= 9 ? "score-excellent" : poi.evDemandScore >= 7 ? "score-good" : "score-average"}`}>
                        {poi.evDemandScore}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => navigate(`/map?lat=${poi.lat}&lng=${poi.lng}`)}
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      查看地图
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
