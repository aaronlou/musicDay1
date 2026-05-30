import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Info } from "lucide-react";

interface PianoKey {
  note: string;
  freq: number;
  type: "white" | "black";
  blackKeyAfter?: string;
}

const PIANO_KEYS: PianoKey[] = [
  { note: "C3", freq: 130.81, type: "white", blackKeyAfter: "C#3" },
  { note: "D3", freq: 146.83, type: "white", blackKeyAfter: "D#3" },
  { note: "E3", freq: 164.81, type: "white" },
  { note: "F3", freq: 174.61, type: "white", blackKeyAfter: "F#3" },
  { note: "G3", freq: 196.0, type: "white", blackKeyAfter: "G#3" },
  { note: "A3", freq: 220.0, type: "white", blackKeyAfter: "A#3" },
  { note: "B3", freq: 246.94, type: "white" },
  { note: "C4", freq: 261.63, type: "white", blackKeyAfter: "C#4" },
  { note: "D4", freq: 293.66, type: "white", blackKeyAfter: "D#4" },
  { note: "E4", freq: 329.63, type: "white" },
  { note: "F4", freq: 349.23, type: "white", blackKeyAfter: "F#4" },
  { note: "G4", freq: 392.0, type: "white", blackKeyAfter: "G#4" },
  { note: "A4", freq: 440.0, type: "white", blackKeyAfter: "A#4" },
  { note: "B4", freq: 493.88, type: "white" },
  { note: "C5", freq: 523.25, type: "white", blackKeyAfter: "C#5" },
  { note: "D5", freq: 587.33, type: "white", blackKeyAfter: "D#5" },
  { note: "E5", freq: 659.25, type: "white" },
];

const BLACK_KEYS: Record<string, number> = {
  "C#3": 138.59,
  "D#3": 155.56,
  "F#3": 185.0,
  "G#3": 207.65,
  "A#3": 233.08,
  "C#4": 277.18,
  "D#4": 311.13,
  "F#4": 369.99,
  "G#4": 415.3,
  "A#4": 466.16,
  "C#5": 554.37,
  "D#5": 622.25,
};

export default function PianoTool() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (freq: number) => {
      if (muted) return;
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch {
        // ignore audio errors
      }
    },
    [muted, getAudioContext]
  );

  const pressKey = useCallback(
    (note: string, freq: number) => {
      setActiveKeys((prev) => new Set(prev).add(note));
      playTone(freq);
      setTimeout(() => {
        setActiveKeys((prev) => {
          const next = new Set(prev);
          next.delete(note);
          return next;
        });
      }, 200);
    },
    [playTone]
  );

  useEffect(() => {
    const keyMap: Record<string, string> = {
      a: "C3",
      w: "C#3",
      s: "D3",
      e: "D#3",
      d: "E3",
      f: "F3",
      t: "F#3",
      g: "G3",
      y: "G#3",
      h: "A3",
      u: "A#3",
      j: "B3",
      k: "C4",
      o: "C#4",
      l: "D4",
      p: "D#4",
      ";": "E4",
    };

    const handler = (e: KeyboardEvent) => {
      const note = keyMap[e.key.toLowerCase()];
      if (note) {
        e.preventDefault();
        const allKeys = [...PIANO_KEYS];
        const whiteKey = allKeys.find((k) => k.note === note);
        if (whiteKey) {
          pressKey(note, whiteKey.freq);
        } else if (BLACK_KEYS[note]) {
          pressKey(note, BLACK_KEYS[note]);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pressKey]);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">虚拟钢琴</h1>
            <p className="text-text-muted">
              点击琴键或使用键盘演奏，边学边弹加深理解
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp((v) => !v)}
              className="p-2 rounded-lg bg-surface-light hover:bg-surface-light/80 transition-colors"
              title="键盘映射"
            >
              <Info className="w-5 h-5 text-text-muted" />
            </button>
            <button
              onClick={() => setMuted((v) => !v)}
              className="p-2 rounded-lg bg-surface-light hover:bg-surface-light/80 transition-colors"
              title={muted ? "开启声音" : "静音"}
            >
              {muted ? (
                <VolumeX className="w-5 h-5 text-danger" />
              ) : (
                <Volume2 className="w-5 h-5 text-success" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Keyboard Mapping Help */}
      {showHelp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-surface rounded-xl p-4 border border-surface-light mb-6"
        >
          <h3 className="font-bold mb-2 text-sm">键盘映射</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-xs text-text-muted">
            {[
              ["A", "C3"],
              ["W", "C#3"],
              ["S", "D3"],
              ["E", "D#3"],
              ["D", "E3"],
              ["F", "F3"],
              ["T", "F#3"],
              ["G", "G3"],
              ["Y", "G#3"],
              ["H", "A3"],
              ["U", "A#3"],
              ["J", "B3"],
              ["K", "C4"],
              ["O", "C#4"],
              ["L", "D4"],
              ["P", "D#4"],
              [";", "E4"],
            ].map(([key, note]) => (
              <div key={key} className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-surface-light rounded text-text font-mono">
                  {key}
                </kbd>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Piano */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-2xl p-4 md:p-6 border border-surface-light overflow-x-auto"
      >
        <div className="relative inline-block min-w-full">
          {/* White keys container */}
          <div className="flex">
            {PIANO_KEYS.map((key) => (
              <button
                key={key.note}
                onMouseDown={() => pressKey(key.note, key.freq)}
                className={`piano-key relative w-10 md:w-14 h-40 md:h-56 border border-gray-300 rounded-b-lg flex items-end justify-center pb-3 text-xs font-medium select-none ${
                  activeKeys.has(key.note)
                    ? "active bg-gray-200"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {key.note}
              </button>
            ))}
          </div>

          {/* Black keys overlay */}
          <div className="absolute top-0 left-0 flex pointer-events-none">
            {PIANO_KEYS.map((key, i) => {
              if (!key.blackKeyAfter) {
                return (
                  <div
                    key={`spacer-${i}`}
                    className="w-10 md:w-14 h-0 flex-shrink-0"
                  />
                );
              }
              const blackFreq = BLACK_KEYS[key.blackKeyAfter];
              return (
                <div key={key.blackKeyAfter} className="relative w-10 md:w-14 flex-shrink-0">
                  <button
                    onMouseDown={() =>
                      pressKey(key.blackKeyAfter!, blackFreq)
                    }
                    className={`piano-key pointer-events-auto absolute left-1/2 -translate-x-1/2 w-6 md:w-8 h-24 md:h-36 rounded-b-lg flex items-end justify-center pb-2 text-[10px] font-medium select-none ${
                      activeKeys.has(key.blackKeyAfter)
                        ? "active bg-gray-700"
                        : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {key.blackKeyAfter}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Scale Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="bg-surface rounded-xl p-5 border border-surface-light">
          <h3 className="font-bold mb-3">C大调音阶</h3>
          <div className="flex flex-wrap gap-2">
            {["C", "D", "E", "F", "G", "A", "B", "C"].map((n, i) => (
              <button
                key={i}
                onClick={() => {
                  const key = PIANO_KEYS.find((k) => k.note === n + "4") || PIANO_KEYS.find((k) => k.note === n + "3");
                  if (key) pressKey(key.note, key.freq);
                }}
                className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors"
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-text-muted text-xs mt-2">全-全-半-全-全-全-半</p>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-surface-light">
          <h3 className="font-bold mb-3">常用和弦</h3>
          <div className="space-y-2">
            {[
              { name: "C大三和弦", notes: ["C4", "E4", "G4"] },
              { name: "G大三和弦", notes: ["G3", "B3", "D4"] },
              { name: "Am小三和弦", notes: ["A3", "C4", "E4"] },
              { name: "F大三和弦", notes: ["F3", "A3", "C4"] },
            ].map((chord) => (
              <button
                key={chord.name}
                onClick={() => {
                  chord.notes.forEach((n, i) => {
                    const key =
                      PIANO_KEYS.find((k) => k.note === n) ||
                      PIANO_KEYS.find((k) => k.note === n.replace(/4/, "3"));
                    if (key) {
                      setTimeout(() => pressKey(key.note, key.freq), i * 80);
                    }
                  });
                }}
                className="w-full flex items-center justify-between px-3 py-2 bg-surface-light hover:bg-primary/20 rounded-lg transition-colors text-sm"
              >
                <span>{chord.name}</span>
                <span className="text-text-muted text-xs">{chord.notes.join("-")}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
