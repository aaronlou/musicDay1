import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Square, Volume2, VolumeX, Guitar, Music, ArrowRight, Info } from "lucide-react";
import {
  COMMON_CHORDS,
  CHORD_PROGRESSIONS,
  GUITAR_STRINGS,
  getFretFreq,
  type GuitarChord,
} from "@/data/guitarChords";

export default function GuitarTool() {
  const [selectedChord, setSelectedChord] = useState<GuitarChord>(COMMON_CHORDS[0]);
  const [muted, setMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [progressionPlaying, setProgressionPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscRef = useRef<OscillatorNode[]>([]);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const stopAll = useCallback(() => {
    activeOscRef.current.forEach((osc) => {
      try { osc.stop(); } catch {}
    });
    activeOscRef.current = [];
  }, []);

  const playChord = useCallback(
    (chord: GuitarChord, duration = 1.5) => {
      if (muted) return;
      stopAll();
      try {
        const ctx = getAudioContext();
        const newOscs: OscillatorNode[] = [];

        chord.frets.forEach((fret, stringIdx) => {
          if (fret < 0) return; // 闷音不弹
          const freq = getFretFreq(stringIdx, fret);
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          // 吉他音色：混合 sawtooth 和 sine
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // 低通滤波让声音更像吉他
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(2000, ctx.currentTime);
          filter.Q.setValueAtTime(1, ctx.currentTime);

          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + duration);
          newOscs.push(osc);
        });

        activeOscRef.current = newOscs;
      } catch {
        // ignore
      }
    },
    [muted, getAudioContext, stopAll]
  );

  const playString = useCallback(
    (stringIdx: number, fret: number) => {
      if (muted || fret < 0) return;
      try {
        const ctx = getAudioContext();
        const freq = getFretFreq(stringIdx, fret);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2500, ctx.currentTime);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.0);
      } catch {}
    },
    [muted, getAudioContext]
  );

  const playProgression = useCallback(
    async (chordNames: string[]) => {
      if (progressionPlaying) return;
      setProgressionPlaying(true);

      for (const name of chordNames) {
        const chord = COMMON_CHORDS.find((c) => c.name === name);
        if (chord) {
          setSelectedChord(chord);
          playChord(chord, 1.2);
          await new Promise((r) => setTimeout(r, 1300));
        }
      }

      setProgressionPlaying(false);
    },
    [playChord, progressionPlaying]
  );

  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  // 获取该和弦实际使用的最高品数
  const maxFret = Math.max(...selectedChord.frets.filter((f) => f > 0), 0);
  const displayFrets = maxFret <= 4 ? 5 : Math.min(maxFret + 1, 6);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">吉他工具</h1>
            <p className="text-text-muted">
              常用吉他和弦指法、和弦进行练习
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp((v) => !v)}
              className="p-2 rounded-lg bg-surface-light hover:bg-surface-light/80 transition-colors"
              title="帮助"
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

      {showHelp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-surface rounded-xl p-4 border border-surface-light mb-6 text-sm text-text-muted"
        >
          <ul className="space-y-1">
            <li>• 点击和弦卡片查看指法并播放</li>
            <li>• 指板图中 X = 闷音（不弹），0 = 空弦，数字 = 按几品</li>
            <li>• 点击指板上的圆点可单独弹奏该弦</li>
            <li>• 使用下方「和弦进行」一键练习经典进行</li>
          </ul>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 和弦选择面板 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Guitar className="w-5 h-5 text-primary" />
            常用和弦
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {COMMON_CHORDS.map((chord) => (
              <button
                key={chord.name}
                onClick={() => {
                  setSelectedChord(chord);
                  playChord(chord);
                }}
                className={`relative p-3 rounded-xl border-2 font-bold text-lg transition-all ${
                  selectedChord.name === chord.name
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-surface-light bg-surface-light/30 hover:border-primary/50 text-text"
                }`}
              >
                {chord.name}
                {chord.tags.includes("大横按") && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-secondary rounded-full" title="大横按" />
                )}
              </button>
            ))}
          </div>

          {/* 当前和弦信息 */}
          <div className="mt-4 bg-surface rounded-xl p-4 border border-surface-light">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-2xl font-bold text-primary">{selectedChord.displayName}</div>
                <div className="text-sm text-text-muted">{selectedChord.fullName}</div>
              </div>
              <button
                onClick={() => playChord(selectedChord)}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                播放
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedChord.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 指板可视化 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold mb-3">指板</h2>
          <div className="bg-surface rounded-xl p-4 md:p-6 border border-surface-light overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* 弦号和空弦/闷音标记 */}
              <div className="flex mb-1">
                <div className="w-8 flex-shrink-0" />
                {selectedChord.frets.map((fret, idx) => (
                  <div
                    key={`head-${idx}`}
                    className="w-10 flex-shrink-0 text-center text-xs font-bold"
                  >
                    {fret === -1 ? (
                      <span className="text-danger">X</span>
                    ) : fret === 0 ? (
                      <span className="text-success">0</span>
                    ) : (
                      <span className="text-text-muted">{GUITAR_STRINGS[idx].note}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* 指板 */}
              <div className="relative">
                {/* 弦线 */}
                {Array.from({ length: displayFrets }).map((_, fretIdx) => (
                  <div key={fretIdx} className="flex items-center h-10">
                    {/* 品号 */}
                    <div className="w-8 flex-shrink-0 text-xs text-text-muted text-right pr-2">
                      {fretIdx === 0 && maxFret <= 4 ? "1" : maxFret > 4 ? maxFret - 2 + fretIdx : fretIdx + 1}
                    </div>

                    {/* 品上的弦 */}
                    {selectedChord.frets.map((fret, stringIdx) => {
                      const actualFret = maxFret <= 4 ? fretIdx + 1 : maxFret - 2 + fretIdx + 1;
                      const isPressed = fret === actualFret;
                      const finger = selectedChord.fingers?.[stringIdx] ?? 0;

                      return (
                        <div
                          key={`${fretIdx}-${stringIdx}`}
                          className="w-10 flex-shrink-0 flex items-center justify-center relative"
                        >
                          {/* 品丝线 */}
                          <div className="absolute left-0 right-0 h-px bg-gray-500" />
                          {isPressed && (
                            <button
                              onClick={() => playString(stringIdx, fret)}
                              className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center z-10 hover:bg-primary-dark transition-colors shadow-lg"
                              title={`${GUITAR_STRINGS[stringIdx].note} 弦第 ${fret} 品`}
                            >
                              {finger > 0 ? finger : ""}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* 弦名 */}
              <div className="flex mt-2">
                <div className="w-8 flex-shrink-0" />
                {GUITAR_STRINGS.map((s) => (
                  <div key={s.number} className="w-10 flex-shrink-0 text-center text-xs text-text-muted">
                    {s.note}{s.octave}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 和弦进行 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Music className="w-5 h-5 text-secondary" />
          和弦进行练习
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHORD_PROGRESSIONS.map((prog) => (
            <div
              key={prog.name}
              className="bg-surface rounded-xl p-4 border border-surface-light"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{prog.name}</div>
                <span className="text-xs text-text-muted bg-surface-light px-2 py-0.5 rounded">
                  {prog.key}
                </span>
              </div>
              <p className="text-text-muted text-sm mb-3">{prog.description}</p>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {prog.chords.map((name, i) => (
                  <span key={i} className="flex items-center">
                    <span className="bg-surface-light text-text px-2 py-1 rounded text-sm font-bold">
                      {name}
                    </span>
                    {i < prog.chords.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-text-muted mx-1" />
                    )}
                  </span>
                ))}
              </div>

              <button
                onClick={() => playProgression(prog.chords)}
                disabled={progressionPlaying}
                className="w-full flex items-center justify-center gap-2 bg-secondary/20 hover:bg-secondary/30 disabled:opacity-40 text-secondary py-2 rounded-lg font-medium transition-colors"
              >
                {progressionPlaying ? (
                  <>
                    <Square className="w-4 h-4" />
                    播放中...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    一键播放
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
