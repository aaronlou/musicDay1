import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * 和弦构成动画
 *
 * 动态展示和弦的音如何从根音逐步构建
 */

interface ChordBuildAnimationProps {
  notes: string[];     // 如 ["C4", "E4", "G4"]
  roles: string[];     // 如 ["根音", "三音", "五音"]
  colors?: string[];
  intervalMs?: number; // 每个音符出现的间隔
}

const NOTE_FREQS: Record<string, number> = {
  C4: 261.63, "C#4": 277.18, D4: 293.66, "D#4": 311.13, E4: 329.63,
  F4: 349.23, "F#4": 369.99, G4: 392.0, "G#4": 415.3, A4: 440.0,
  "A#4": 466.16, B4: 493.88, C5: 523.25,
};

const DEFAULT_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899"];

export default function ChordBuildAnimation({
  notes,
  roles,
  colors = DEFAULT_COLORS,
  intervalMs = 800,
}: ChordBuildAnimationProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playNote = (freq: number, delay: number) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 1.2);
  };

  const start = () => {
    if (playing) return;
    setPlaying(true);
    setVisibleCount(0);

    notes.forEach((note, i) => {
      const freq = NOTE_FREQS[note] ?? 440;
      playNote(freq, i * (intervalMs / 1000));
      timerRef.current = setTimeout(() => {
        setVisibleCount((c) => c + 1);
      }, i * intervalMs);
    });

    timerRef.current = setTimeout(() => {
      setPlaying(false);
    }, notes.length * intervalMs + 500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-surface rounded-xl border border-surface-light p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold">和弦构成演示</span>
        <button
          onClick={start}
          disabled={playing}
          className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
        >
          {playing ? "播放中..." : "▶ 播放动画"}
        </button>
      </div>

      <div className="flex items-end justify-center gap-4 h-28">
        {notes.map((note, i) => {
          const isVisible = i < visibleCount;
          const freq = NOTE_FREQS[note] ?? 440;
          // 用频率映射高度
          const barHeight = Math.min(80, ((freq - 200) / 400) * 80 + 20);

          return (
            <motion.div
              key={note}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isVisible ? 1 : 0.2,
                y: isVisible ? 0 : 20,
                scale: isVisible ? 1 : 0.8,
              }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div
                className="w-12 rounded-t-lg transition-all duration-300"
                style={{
                  height: isVisible ? barHeight : 8,
                  backgroundColor: colors[i % colors.length],
                  opacity: isVisible ? 1 : 0.3,
                }}
              />
              <div className="text-xs font-bold text-text">{note}</div>
              <div className="text-[10px] text-text-muted">{roles[i]}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
