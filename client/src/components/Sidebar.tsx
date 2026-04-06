import { useLocation } from "wouter";
import {
  LayoutDashboard, Map, Flame, Bot, Network,
  FileText, Clock, Zap, ChevronRight
} from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "数据大屏", desc: "总览" },
  { path: "/map", icon: Map, label: "地图选址", desc: "选址分析" },
  { path: "/heatmap", icon: Flame, label: "热力分析", desc: "流量热图" },
  { path: "/ai", icon: Bot, label: "AI智能分析", desc: "深度咨询" },
  { path: "/knowledge", icon: Network, label: "知识图谱", desc: "关联图谱" },
  { path: "/reports", icon: FileText, label: "选址报告", desc: "PDF报告" },
  { path: "/history", icon: Clock, label: "历史记忆", desc: "会话记录" },
];

export default function Sidebar() {
  const [location, navigate] = useLocation();

  return (
    <aside
      className="flex flex-col w-56 h-screen border-r shrink-0"
      style={{
        background: "linear-gradient(180deg, oklch(0.13 0.022 240) 0%, oklch(0.11 0.018 240) 100%)",
        borderColor: "oklch(0.22 0.028 240)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "oklch(0.22 0.028 240)" }}>
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
          style={{
            background: "linear-gradient(135deg, oklch(0.62 0.22 200), oklch(0.52 0.24 170))",
            boxShadow: "0 0 16px oklch(0.62 0.22 200 / 0.4)",
          }}
        >
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-foreground leading-tight truncate">福州新能源</div>
          <div className="text-xs text-muted-foreground leading-tight truncate">充电桩智能选址</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item w-full text-left group ${isActive ? "active" : ""}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm leading-tight">{item.label}</div>
                <div className="text-xs opacity-60 leading-tight">{item.desc}</div>
              </div>
              {isActive && <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t" style={{ borderColor: "oklch(0.22 0.028 240)" }}>
        <div className="flex items-center gap-2">
          <div className="pulse-dot" />
          <span className="text-xs text-muted-foreground">系统运行中</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1 opacity-50">v4.0 · 福州市数据</div>
      </div>
    </aside>
  );
}
