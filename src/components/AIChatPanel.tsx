import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  X,
  Sparkles,
  User,
  Trash2,
  Settings,
  Loader2,
} from "lucide-react";
import { useAI } from "@/hooks/useAI";
import { Link } from "react-router-dom";

interface AIChatPanelProps {
  lessonId: string;
  lessonTitle: string;
  chapterTitle: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AIChatPanel({
  lessonId,
  lessonTitle,
  chapterTitle,
  isOpen,
  onToggle,
}: AIChatPanelProps) {
  const { messages, loading, sendMessage, clearHistory, enabled } =
    useAI(lessonId);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const systemPrompt = `你是一位经验丰富、充满耐心的音乐理论老师，正在教授一位零基础学生。

当前课程：${chapterTitle} - ${lessonTitle}

你的教学风格：
1. 用简单易懂的语言解释概念，多用比喻和例子
2. 鼓励学生，不要打击积极性
3. 回答要简洁但完整，避免过于学术化的术语
4. 如果涉及到音高，可以描述为"高音/低音"；涉及到音程，可以建议学生使用App内的虚拟钢琴来感受
5. 如果学生问与当前课程相关的问题，结合当前知识点回答
6. 如果学生问课程之外的问题，也友好地回答，但可以建议他们先掌握当前内容

请用中文回答。`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim(), systemPrompt);
    setInput("");
  };

  const quickQuestions = [
    "这个概念我还是不太懂，能用更简单的方式解释一下吗？",
    "这和之前学的知识有什么联系？",
    "能不能给我举一个生活中的例子？",
    "我记住了这个知识点，接下来应该学什么？",
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed right-4 bottom-4 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen
            ? "bg-surface-light text-text-muted"
            : enabled
            ? "bg-primary text-white hover:bg-primary-dark"
            : "bg-surface-light text-text-muted"
        }`}
        title="AI 乐理导师"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-surface border-l border-surface-light z-40 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-surface-light flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm">AI 乐理导师</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => clearHistory(lessonId)}
                  className="p-2 rounded-lg hover:bg-surface-light text-text-muted transition-colors"
                  title="清空对话"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onToggle}
                  className="p-2 rounded-lg hover:bg-surface-light text-text-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {!enabled ? (
                <div className="text-center text-text-muted text-sm mt-10">
                  <Bot className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="mb-2">AI 乐理导师尚未启用</p>
                  <p className="text-xs mb-4">
                    配置你的 LLM API Key 后，即可与 AI 老师互动学习
                  </p>
                  <Link
                    to="/settings"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    去设置
                  </Link>
                </div>
              ) : messages.length === 0 ? (
                <div>
                  <div className="text-center text-text-muted text-sm mb-4">
                    <Bot className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>我是你的 AI 乐理导师</p>
                    <p className="text-xs mt-1">
                      有任何问题都可以问我，我会结合当前课程内容为你解答
                    </p>
                  </div>
                  <div className="space-y-2">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(q);
                        }}
                        className="w-full text-left text-xs text-text-muted bg-surface-light hover:bg-primary/10 hover:text-primary p-3 rounded-lg transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === "user"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary/20 text-secondary"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-primary/20 text-text"
                          : "bg-surface-light text-text"
                      }`}
                    >
                      {msg.content || (
                        <span className="flex items-center gap-1 text-text-muted">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          思考中...
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary/20 text-secondary">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-surface-light rounded-xl px-3 py-2 text-sm text-text-muted flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    思考中...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            {enabled && (
              <div className="p-3 border-t border-surface-light flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="向 AI 老师提问..."
                    className="flex-1 bg-surface-light rounded-lg px-3 py-2 text-sm outline-none border border-transparent focus:border-primary text-text placeholder:text-text-muted"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="bg-primary hover:bg-primary-dark disabled:opacity-40 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
