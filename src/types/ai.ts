export type LLMProvider = "openai" | "anthropic" | "deepseek" | "openrouter";

export interface AISettings {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  enabled: boolean;
}

export const DEFAULT_MODELS: Record<LLMProvider, string[]> = {
  openai: ["gpt-4.1-mini", "gpt-4.1", "gpt-4o-mini", "gpt-4o"],
  anthropic: ["claude-sonnet-4-20250514", "claude-opus-4-20250514"],
  deepseek: ["deepseek-chat", "deepseek-reasoner"],
  openrouter: ["openai/gpt-4o-mini", "anthropic/claude-sonnet-4", "deepseek/deepseek-chat-v3-0324"],
};

export const PROVIDER_BASE_URLS: Record<LLMProvider, string> = {
  openai: "https://api.openai.com/v1",
  anthropic: "https://api.anthropic.com/v1",
  deepseek: "https://api.deepseek.com/v1",
  openrouter: "https://openrouter.ai/api/v1",
};

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface LessonChatHistory {
  lessonId: string;
  messages: ChatMessage[];
}
