import { useState, useCallback } from "react";

const IMAGE_SETTINGS_KEY = "musicday1-image-settings";
const IMAGE_CACHE_KEY = "musicday1-image-cache";

export interface ImageGenSettings {
  enabled: boolean;
  provider: "openai" | "openrouter";
  apiKey: string;
  model: string;
}

export function loadImageSettings(): ImageGenSettings {
  try {
    const raw = localStorage.getItem(IMAGE_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    enabled: false,
    provider: "openai",
    apiKey: "",
    model: "gpt-image-1",
  };
}

export function saveImageSettings(s: ImageGenSettings) {
  localStorage.setItem(IMAGE_SETTINGS_KEY, JSON.stringify(s));
}

export interface CachedImage {
  prompt: string;
  dataUrl: string;
  createdAt: number;
}

export function loadImageCache(): Record<string, CachedImage> {
  try {
    const raw = localStorage.getItem(IMAGE_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function saveImageCache(cache: Record<string, CachedImage>) {
  localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
}

export function useImageGen() {
  const [settings, setSettingsState] = useState<ImageGenSettings>(loadImageSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setSettings = useCallback((s: Partial<ImageGenSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...s };
      saveImageSettings(next);
      return next;
    });
  }, []);

  const generateImage = useCallback(
    async (prompt: string): Promise<string | null> => {
      if (!settings.enabled || !settings.apiKey) return null;

      // Check cache
      const cache = loadImageCache();
      const cacheKey = `${settings.provider}:${settings.model}:${prompt}`;
      if (cache[cacheKey]) {
        return cache[cacheKey].dataUrl;
      }

      setLoading(true);
      setError(null);

      try {
        let dataUrl: string;

        if (settings.provider === "openai") {
          const res = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${settings.apiKey}`,
            },
            body: JSON.stringify({
              model: settings.model,
              prompt,
              n: 1,
              size: "1024x1024",
              response_format: "b64_json",
            }),
          });
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          const data = await res.json();
          dataUrl = `data:image/png;base64,${data.data[0].b64_json}`;
        } else {
          // OpenRouter
          const res = await fetch("https://openrouter.ai/api/v1/images/generations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${settings.apiKey}`,
              "HTTP-Referer": "https://musicday1.app",
              "X-Title": "MusicDay1",
            },
            body: JSON.stringify({
              model: settings.model,
              prompt,
              n: 1,
              size: "1024x1024",
            }),
          });
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          const data = await res.json();
          dataUrl = data.data?.[0]?.url ?? data.data?.[0]?.b64_json;
        }

        // Cache
        cache[cacheKey] = { prompt, dataUrl, createdAt: Date.now() };
        saveImageCache(cache);

        setLoading(false);
        return dataUrl;
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        return null;
      }
    },
    [settings]
  );

  return { settings, setSettings, generateImage, loading, error };
}
