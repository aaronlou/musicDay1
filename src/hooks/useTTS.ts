import { useState, useCallback, useRef } from "react";
import { speakText, stopSpeech as stopBackendSpeech } from "@/api";

export interface TTSVoice {
  name: string;
  lang: string;
  default?: boolean;
}

function isMacOS(): boolean {
  return navigator.platform.toLowerCase().includes("mac");
}

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(() => {
    // macOS backend TTS via `say` is always supported when running inside Tauri
    if (isMacOS() && "__TAURI_INTERNALS__" in window) return true;
    return "speechSynthesis" in window;
  });
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const usingBackendRef = useRef(false);

  const getVoices = useCallback((): TTSVoice[] => {
    if (!("speechSynthesis" in window)) return [];
    return window.speechSynthesis.getVoices().map((v) => ({
      name: v.name,
      lang: v.lang,
      default: v.default,
    }));
  }, []);

  const speak = useCallback(
    async (text: string, rate = 1.0, pitch = 1.0) => {
      // Stop any ongoing speech first
      stop();

      const canUseBackend =
        isMacOS() && "__TAURI_INTERNALS__" in window;

      if (canUseBackend) {
        try {
          usingBackendRef.current = true;
          setSpeaking(true);
          await speakText(text);
          // `say` command has no callback, so we estimate duration
          // Chinese: ~4 chars/sec at normal speed
          const estimatedMs = (text.length / 4) * 1000 * (1 / rate);
          setTimeout(() => {
            if (usingBackendRef.current) {
              setSpeaking(false);
              usingBackendRef.current = false;
            }
          }, estimatedMs);
          return;
        } catch {
          // Fallback to browser TTS on error
          usingBackendRef.current = false;
        }
      }

      // Browser Web Speech API fallback
      if (!("speechSynthesis" in window)) return;
      usingBackendRef.current = false;

      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "zh-CN";
      utter.rate = rate;
      utter.pitch = pitch;

      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find((v) => v.lang.startsWith("zh"));
      if (zhVoice) utter.voice = zhVoice;

      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);

      utterRef.current = utter;
      window.speechSynthesis.speak(utter);
    },
    []
  );

  const stop = useCallback(() => {
    if (usingBackendRef.current) {
      stopBackendSpeech().catch(() => {});
      usingBackendRef.current = false;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported, getVoices };
}
