import { useState, useEffect, useCallback, useRef } from "react";
import type { AISettings, ChatMessage } from "@/types/ai";
import { PROVIDER_BASE_URLS, DEFAULT_MODELS } from "@/types/ai";

const AI_SETTINGS_KEY = "musicday1-ai-settings";
const CHAT_HISTORY_KEY = "musicday1-chat-history";

const defaultSettings: AISettings = {
  provider: "deepseek",
  apiKey: "",
  model: DEFAULT_MODELS.deepseek[0],
  enabled: false,
};

function loadSettings(): AISettings {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultSettings };
}

function saveSettings(s: AISettings) {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(s));
}

function loadHistory(): Record<string, ChatMessage[]> {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveHistory(h: Record<string, ChatMessage[]>) {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(h));
}

export function useAI(lessonId?: string) {
  const [settings, setSettingsState] = useState<AISettings>(loadSettings);
  const [history, setHistoryState] = useState<Record<string, ChatMessage[]>>(loadHistory);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const messages = lessonId ? history[lessonId] ?? [] : [];

  const setSettings = useCallback((s: Partial<AISettings>) => {
    setSettingsState((prev) => ({ ...prev, ...s }));
  }, []);

  const addMessage = useCallback(
    (lessonId: string, msg: ChatMessage) => {
      setHistoryState((prev) => {
        const msgs = [...(prev[lessonId] ?? []), msg];
        return { ...prev, [lessonId]: msgs };
      });
    },
    []
  );

  const clearHistory = useCallback((lessonId: string) => {
    setHistoryState((prev) => {
      const next = { ...prev };
      delete next[lessonId];
      return next;
    });
  }, []);

  const sendMessage = useCallback(
    async (content: string, systemPrompt: string) => {
      if (!lessonId || !settings.apiKey || !settings.enabled) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: Date.now(),
      };
      addMessage(lessonId, userMsg);
      setLoading(true);

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const assistantMsgId = crypto.randomUUID();
      addMessage(lessonId, {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      });

      const prevMessages = (history[lessonId] ?? []).slice(-10);
      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...prevMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content },
      ];

      let responseText = "";

      try {
        if (settings.provider === "anthropic") {
          const res = await fetch(`${PROVIDER_BASE_URLS.anthropic}/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": settings.apiKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: settings.model,
              max_tokens: 2048,
              messages: apiMessages.filter((m) => m.role !== "system"),
              system: systemPrompt,
            }),
            signal: abortRef.current.signal,
          });
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          const data = await res.json();
          responseText = data.content?.[0]?.text ?? "";
        } else {
          const res = await fetch(`${PROVIDER_BASE_URLS[settings.provider]}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${settings.apiKey}`,
            },
            body: JSON.stringify({
              model: settings.model,
              messages: apiMessages,
              temperature: 0.7,
            }),
            signal: abortRef.current.signal,
          });
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          const data = await res.json();
          responseText = data.choices?.[0]?.message?.content ?? "";
        }

        setHistoryState((prev) => {
          const msgs = prev[lessonId] ?? [];
          const updated = msgs.map((m) =>
            m.id === assistantMsgId ? { ...m, content: responseText } : m
          );
          return { ...prev, [lessonId]: updated };
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setHistoryState((prev) => {
            const msgs = prev[lessonId] ?? [];
            const updated = msgs.map((m) =>
              m.id === assistantMsgId ? { ...m, content: `抱歉，AI 请求出错：${err.message}` } : m
            );
            return { ...prev, [lessonId]: updated };
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [settings, lessonId, history, addMessage]
  );

  return {
    settings,
    setSettings,
    messages,
    loading,
    sendMessage,
    clearHistory,
    enabled: settings.enabled && !!settings.apiKey,
  };
}
