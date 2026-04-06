import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Flame, Car, BarChart2 } from "lucide-react";
import { toast } from "sonner";

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY ?? "";
const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE ?? "";

declare global { interface Window { AMap: any; _AMapSecurityConfig: any; } }

export default function HeatMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const heatmapRef = useRef<any>(null);
  const [mode, setMode] = useState<"traffic" | "ev">("traffic");
  const [loaded, setLoaded] = useState(false);

  const { data: trafficResult } = trpc.maps.getTrafficFlow.useQuery();

  useEffect(() => {
    if (window.AMap) { setLoaded(true); return; }
    window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE };
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.HeatMap`;
    script.onload = () => setLoaded(true);
    script.onerror = () => toast.error("地图加载失败");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || mapInstance.current) return;
    const map = new window.AMap.Map(mapRef.current, {
      zoom: 12, center: [119.3012, 26.0756],
      mapStyle: "amap://styles/dark",
    });
    mapInstance.current = map;
    window.AMap.plugin("AMap.HeatMap", () => {
      heatmapRef.current = new window.AMap.HeatMap(map, {
        radius: 35, opacity: [0, 0.85],
        gradient: {
          0.1: "#1a237e", 0.3: "#1565c0", 0.5: "#00838f",
          0.7: "#2e7d32", 0.85: "#f9a825", 1.0: "#b71c1c",
        },
      });
    });
  }, [loaded]);

  useEffect(() => {
    if (!heatmapRef.current || !trafficResult?.data) return;
    const data = trafficResult.data.map(r => ({
      lng: r.centerLng,
      lat: r.centerLat,
      count: mode === "traffic"
        ? r.dailyFlow / 1000
        : r.dailyFlow * r.evRatio / 100,
    }));
    heatmapRef.current.setDataSet({ data, max: mode === "traffic" ? 85 : 8 });
  }, [trafficResult, mode, loaded]);

  const stats = trafficResult?.data ?? [];
  const totalFlow = stats.reduce((s, r) => s + r.dailyFlow, 0);
  const avgEvRatio = stats.length ? stats.reduce((s, r) => s + r.evRatio, 0) / stats.length : 0;
  const maxFlow = stats.length ? Math.max(...stats.map(r => r.dailyFlow)) : 0;

  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-foreground">热力图分析</h1>
          <p className="text-sm text-muted-foreground mt-0.5">基于道路交通流量与新能源车占比生成热力图</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        {[
          { icon: BarChart2, label: "总日均流量", value: `${(totalFlow / 10000).toFixed(1)}万辆`, color: "oklch(0.62 0.22 200)" },
          { icon: Car, label: "平均新能源占比", value: `${(avgEvRatio * 100).toFixed(1)}%`, color: "oklch(0.52 0.24 170)" },
          { icon: Flame, label: "最高流量道路", value: `${(maxFlow / 1000).toFixed(0)}k辆/日`, color: "oklch(0.75 0.18 60)" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="tech-card p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <div className="text-base font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 模式切换 */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground">热力图模式：</span>
        {[
          { key: "traffic" as const, label: "交通流量热力图", icon: BarChart2 },
          { key: "ev" as const, label: "新能源车热力图", icon: Car },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
            style={{
              background: mode === key ? "oklch(0.62 0.22 200 / 0.2)" : "oklch(0.18 0.022 240)",
              border: `1px solid ${mode === key ? "oklch(0.62 0.22 200 / 0.5)" : "oklch(0.25 0.03 240)"}`,
              color: mode === key ? "oklch(0.72 0.18 200)" : "oklch(0.55 0.02 240)",
            }}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {/* 地图 */}
      <div className="relative flex-1 rounded-lg overflow-hidden" style={{ border: "1px solid oklch(0.22 0.028 240)" }}>
        <div ref={mapRef} className="w-full h-full" />
        {!AMAP_KEY && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80">
            <div className="text-sm text-muted-foreground">请配置高德地图 API Key</div>
          </div>
        )}
        {/* 色阶图例 */}
        <div className="absolute bottom-4 left-4 tech-card p-3 text-xs">
          <div className="text-muted-foreground mb-2">{mode === "traffic" ? "流量强度" : "新能源密度"}</div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">低</span>
            <div className="w-24 h-3 rounded" style={{
              background: "linear-gradient(90deg, #1a237e, #1565c0, #00838f, #2e7d32, #f9a825, #b71c1c)"
            }} />
            <span className="text-muted-foreground">高</span>
          </div>
        </div>
      </div>

      {/* 道路列表 */}
      <div className="tech-card p-3 shrink-0 max-h-36 overflow-y-auto">
        <div className="text-xs font-medium text-foreground mb-2">道路流量详情</div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5">
          {stats.sort((a, b) => b.dailyFlow - a.dailyFlow).slice(0, 12).map(r => (
            <div key={r.id} className="flex items-center justify-between text-xs px-2 py-1 rounded" style={{ background: "oklch(0.18 0.022 240)" }}>
              <span className="text-muted-foreground truncate mr-2">{r.roadName}</span>
              <span className="text-foreground shrink-0">{(r.dailyFlow / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
