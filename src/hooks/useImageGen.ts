import { useState, useCallback, useEffect } from "react";
import { getImageGenStatus, updateImageGenConfig, generateImage as tauriGenerateImage } from "@/api";
import type { ImageGenStatusDto } from "@/api/types";

const IMAGE_CACHE_KEY = "musicday1-image-cache";

export interface CachedImage {
  prompt: string;
  dataUrl: string;
  createdAt: number;
}

function loadImageCache(): Record<string, CachedImage> {
  try {
    const raw = localStorage.getItem(IMAGE_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveImageCache(cache: Record<string, CachedImage>) {
  localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
}

export function useImageGen() {
  const [status, setStatus] = useState<ImageGenStatusDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getImageGenStatus().then(setStatus);
  }, []);

  const setBackend = useCallback(
    async (backend: string) => {
      const s = await updateImageGenConfig({ backend });
      setStatus(s);
    },
    []
  );

  const setApiKey = useCallback(
    async (apiKey: string) => {
      const s = await updateImageGenConfig({ api_key: apiKey });
      setStatus(s);
    },
    []
  );

  const generateImage = useCallback(
    async (prompt: string): Promise<string | null> => {
      if (!status?.enabled) return null;

      // Check cache
      const cache = loadImageCache();
      const cacheKey = `${status.backend}:${prompt}`;
      if (cache[cacheKey]) {
        return cache[cacheKey].dataUrl;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await tauriGenerateImage(prompt);

        if (!result.base64) {
          throw new Error("Image generation returned no data");
        }

        const dataUrl = `data:image/png;base64,${result.base64}`;

        // Cache
        cache[cacheKey] = { prompt, dataUrl, createdAt: Date.now() };
        saveImageCache(cache);

        setLoading(false);
        return dataUrl;
      } catch (err: any) {
        setError(err.message ?? err);
        setLoading(false);
        return null;
      }
    },
    [status]
  );

  return {
    status,
    setBackend,
    setApiKey,
    generateImage,
    loading,
    error,
  };
}
