import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Clock, Trash2, MessageSquare, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";

const SESSION_KEY = "ev_session_id";
function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) { id = nanoid(12); sessionStorage.setItem(SESSION_KEY, id); }
  return id;
}

export default function History() {
  const [sessionId] = useState(getSessionId);
  const utils = trpc.useUtils();

  const { data: sessions } = trpc.memory.getSessions.useQuery();
  const { data: chatHistory } = trpc.analysis.getHistory.useQuery({ sessionId });
  const { data: reportHistory } = trpc.reports.list.useQuery({ sessionId });
  const clearMutation = trpc.memory.clearSession.useMutation({
    onSuccess: () => {
      utils.memory.getSessions.invalidate();
      utils.analysis.getHistory.invalidate();
      utils.reports.list.invalidate();
      toast.success("记忆已清除");
    },
  });

  const handleClear = () => {
    if (!confirm("确定要清除所有历史记录吗？此操作不可撤销。")) return;
    clearMutation.mutate({ sessionId });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">历史记忆</h1>
          <p className="text-sm text-muted-foreground mt-0.5">选址历史、对话记录与会话管理</p>
        </div>
        <button
          onClick={handleClear}
          disabled={clearMutation.isPending}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ background: "oklch(0.60 0.22 25 / 0.15)", border: "1px solid oklch(0.60 0.22 25 / 0.3)", color: "oklch(0.70 0.20 25)" }}
        >
          <Trash2 className="w-4 h-4" />
          清除所有记忆
        </button>
      </div>

      {/* 会话统计 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Clock, label: "会话数", value: (sessions ?? []).length, color: "oklch(0.62 0.22 200)" },
          { icon: MessageSquare, label: "对话记录", value: (chatHistory ?? []).length, color: "oklch(0.52 0.24 170)" },
          { icon: FileText, label: "生成报告", value: (reportHistory ?? []).length, color: "oklch(0.75 0.18 60)" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="tech-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 对话历史 */}
        <div className="tech-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">AI对话历史</h3>
            <span className="text-xs text-muted-foreground ml-auto">{(chatHistory ?? []).length} 条</span>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {(chatHistory ?? []).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">暂无对话记录</div>
            ) : (
              (chatHistory ?? []).map((h: any) => (
                <div key={h.id} className="p-3 rounded-lg" style={{ background: "oklch(0.18 0.022 240)", border: "1px solid oklch(0.22 0.028 240)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-primary font-medium">用户提问</span>
                    <span className="text-xs text-muted-foreground">{new Date(h.createdAt).toLocaleString("zh-CN")}</span>
                  </div>
                  <div className="text-xs text-foreground mb-1 truncate">{h.userMessage}</div>
                  <div className="text-xs text-muted-foreground truncate">{h.aiResponse?.substring(0, 80)}...</div>
                  {h.totalScore > 0 && (
                    <div className="mt-1 text-xs">
                      <span className="text-muted-foreground">评分：</span>
                      <span className="text-primary font-medium">{h.totalScore}</span>
                      <span className="text-muted-foreground ml-2">位置：({h.lat?.toFixed(4)}, {h.lng?.toFixed(4)})</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 报告历史 */}
        <div className="tech-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">报告历史</h3>
            <span className="text-xs text-muted-foreground ml-auto">{(reportHistory ?? []).length} 份</span>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {(reportHistory ?? []).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">暂无报告记录</div>
            ) : (
              (reportHistory ?? []).map((r: any) => (
                <div key={r.id} className="p-3 rounded-lg" style={{ background: "oklch(0.18 0.022 240)", border: "1px solid oklch(0.22 0.028 240)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground font-medium truncate">{r.address}</span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{new Date(r.createdAt).toLocaleDateString("zh-CN")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>评分：<span className="text-primary font-medium">{r.totalScore}</span></span>
                    <span>位置：({r.lat?.toFixed(4)}, {r.lng?.toFixed(4)})</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 当前会话ID */}
      <div className="tech-card p-3 flex items-center gap-3">
        <RefreshCw className="w-4 h-4 text-muted-foreground" />
        <div className="text-xs text-muted-foreground">
          当前会话ID：<span className="text-foreground font-mono">{sessionId}</span>
        </div>
      </div>
    </div>
  );
}
