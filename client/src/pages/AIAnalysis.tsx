import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Bot, Send, MapPin, Trash2, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { Streamdown } from "streamdown";

const SESSION_KEY = "ev_session_id";

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) { id = nanoid(12); sessionStorage.setItem(SESSION_KEY, id); }
  return id;
}

const QUICK_QUESTIONS = [
  "这个位置适合建充电站吗？",
  "周边有哪些高需求POI？",
  "分析一下竞争情况",
  "给出具体的选址建议",
  "这里的交通流量如何？",
];

export default function AIAnalysis() {
  const [sessionId] = useState(getSessionId);
  const [lat, setLat] = useState(26.0756);
  const [lng, setLng] = useState(119.3034);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const aiMutation = trpc.analysis.aiAnalysis.useMutation();
  const scoreMutation = trpc.analysis.quickScore.useMutation();
  const [score, setScore] = useState<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchScore = useCallback(async () => {
    try {
      const result = await scoreMutation.mutateAsync({ lat, lng });
      setScore(result);
    } catch {}
  }, [lat, lng]);

  useEffect(() => { fetchScore(); }, [lat, lng]);

  const sendMessage = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || isLoading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setIsLoading(true);
    try {
      const result = await aiMutation.mutateAsync({
        lat, lng, userMessage: msg, sessionId,
        history: messages.slice(-6),
      });
      const aiContent = typeof result.content === "string" ? result.content : String(result.content);
      setMessages(prev => [...prev, { role: "assistant", content: aiContent }]);
      if (result.score) setScore(result.score);
    } catch (err) {
      toast.error("AI分析失败，请重试");
      setMessages(prev => [...prev, { role: "assistant", content: "抱歉，分析服务暂时不可用，请稍后重试。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const gradeColor = !score ? "" : score.totalScore >= 8.5 ? "score-excellent"
    : score.totalScore >= 7 ? "score-good"
    : score.totalScore >= 5.5 ? "score-average"
    : score.totalScore > 0 ? "score-poor" : "score-na";

  return (
    <div className="flex h-screen p-4 gap-4">
      {/* 左侧：位置 + 评分 */}
      <div className="w-64 shrink-0 flex flex-col gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">AI智能分析</h1>
          <p className="text-xs text-muted-foreground mt-0.5">基于DeepSeek的对话式选址咨询</p>
        </div>

        {/* 坐标输入 */}
        <div className="tech-card p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            分析位置
          </div>
          {[
            { label: "纬度", value: lat, setter: setLat },
            { label: "经度", value: lng, setter: setLng },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="text-xs text-muted-foreground">{label}</label>
              <input
                type="number"
                value={value}
                step={0.001}
                onChange={e => setter(parseFloat(e.target.value) || 0)}
                className="w-full mt-0.5 px-2 py-1.5 rounded text-xs text-foreground"
                style={{ background: "oklch(0.18 0.022 240)", border: "1px solid oklch(0.25 0.03 240)" }}
              />
            </div>
          ))}
          <button
            onClick={fetchScore}
            disabled={scoreMutation.isPending}
            className="w-full py-1.5 rounded text-xs font-medium transition-all"
            style={{ background: "oklch(0.62 0.22 200 / 0.2)", border: "1px solid oklch(0.62 0.22 200 / 0.4)", color: "oklch(0.72 0.18 200)" }}
          >
            {scoreMutation.isPending ? "评分中..." : "重新评分"}
          </button>
        </div>

        {/* 评分卡片 */}
        {score && (
          <div className="tech-card-glow p-3">
            <div className="text-xs font-medium text-foreground mb-2">快速评分</div>
            <div className="flex items-center gap-2 mb-3">
              <div className={`text-3xl font-bold ${gradeColor}`}>{score.totalScore}</div>
              <div>
                <div className={`text-sm font-semibold ${gradeColor}`}>{score.grade}</div>
                <div className="text-xs text-muted-foreground">/ 10分</div>
              </div>
            </div>
            {score.exclusionConflicts?.length > 0 && (
              <div className="text-xs text-destructive mb-2">⚠ 禁区冲突：{score.exclusionConflicts.join("、")}</div>
            )}
            {[
              { label: "POI密度", v: score.scoreBreakdown?.poi },
              { label: "交通流量", v: score.scoreBreakdown?.traffic },
              { label: "可达性", v: score.scoreBreakdown?.accessibility },
              { label: "竞争分析", v: score.scoreBreakdown?.competition },
            ].map(({ label, v }) => (
              <div key={label} className="mb-1.5">
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground">{v ?? 0}</span>
                </div>
                <div className="score-bar">
                  <div className="score-bar-fill" style={{ width: `${(v ?? 0) * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 快捷问题 */}
        <div className="tech-card p-3">
          <div className="text-xs font-medium text-foreground mb-2">快捷问题</div>
          <div className="space-y-1">
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={isLoading}
                className="w-full text-left text-xs px-2 py-1.5 rounded transition-all hover:bg-secondary text-muted-foreground hover:text-foreground"
                style={{ border: "1px solid oklch(0.22 0.028 240)" }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧：对话框 */}
      <div className="flex-1 flex flex-col tech-card overflow-hidden">
        {/* 对话头 */}
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0" style={{ borderColor: "oklch(0.22 0.028 240)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "oklch(0.62 0.22 200 / 0.2)" }}>
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">选址智能助手</div>
              <div className="text-xs text-muted-foreground">DeepSeek · 实时分析</div>
            </div>
          </div>
          <button
            onClick={() => setMessages([])}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* 消息区 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "oklch(0.62 0.22 200 / 0.1)" }}>
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <div className="text-sm font-medium text-foreground mb-1">福州充电桩选址助手</div>
              <div className="text-xs text-muted-foreground max-w-xs">
                我可以帮您分析候选位置的选址可行性、周边环境、竞争态势，并给出专业建议。
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: msg.role === "user" ? "oklch(0.62 0.22 200 / 0.2)" : "oklch(0.52 0.24 170 / 0.2)" }}
              >
                {msg.role === "user" ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4 text-accent" />}
              </div>
              <div
                className="max-w-[80%] px-3 py-2 rounded-lg text-sm"
                style={{
                  background: msg.role === "user" ? "oklch(0.62 0.22 200 / 0.15)" : "oklch(0.18 0.022 240)",
                  border: `1px solid ${msg.role === "user" ? "oklch(0.62 0.22 200 / 0.25)" : "oklch(0.22 0.028 240)"}`,
                  color: "oklch(0.88 0.01 240)",
                }}
              >
                {msg.role === "assistant" ? (
                  <Streamdown>{msg.content}</Streamdown>
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "oklch(0.52 0.24 170 / 0.2)" }}>
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div className="px-3 py-2 rounded-lg" style={{ background: "oklch(0.18 0.022 240)", border: "1px solid oklch(0.22 0.028 240)" }}>
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* 输入框 */}
        <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "oklch(0.22 0.028 240)" }}>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="输入问题，例如：这个位置适合建充电站吗？"
              className="flex-1 px-3 py-2 rounded-lg text-sm text-foreground placeholder:text-muted-foreground"
              style={{ background: "oklch(0.18 0.022 240)", border: "1px solid oklch(0.25 0.03 240)" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="px-3 py-2 rounded-lg transition-all disabled:opacity-50"
              style={{ background: "oklch(0.62 0.22 200)", color: "oklch(0.10 0.018 240)" }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
