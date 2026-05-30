/**
 * 和弦构成可视化组件
 *
 * 显示和弦的音组成：根音、三音、五音（以及七音）
 * 同时在钢琴键盘上高亮显示
 */

import { useMemo } from "react";

interface ChordVisualizerProps {
  root: string;      // 根音，如 "C", "G"
  quality: string;   // 性质，如 "major", "minor", "dim", "aug", "maj7", "dom7", "min7"
}

interface ChordNote {
  note: string;
  role: string;
  semitones: number;
  color: string;
}

const SEMITONE_MAP: Record<string, number> = {
  "C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3,
  "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8,
  "A": 9, "A#": 10, "Bb": 10, "B": 11,
};

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteAtSemitone(root: string, semitones: number): string {
  const base = SEMITONE_MAP[root];
  if (base === undefined) return root;
  return NOTE_NAMES[(base + semitones) % 12];
}

const CHORD_FORMULAS: Record<string, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  maj7: [0, 4, 7, 11],
  dom7: [0, 4, 7, 10],
  min7: [0, 3, 7, 10],
  m7b5: [0, 3, 6, 10],
};

const ROLE_NAMES = ["根音", "三音", "五音", "七音"];

const ROLE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899"];

export default function ChordVisualizer({
  root,
  quality,
}: ChordVisualizerProps) {
  const notes = useMemo<ChordNote[]>(() => {
    const formula = CHORD_FORMULAS[quality] ?? CHORD_FORMULAS.major;
    return formula.map((st, i) => ({
      note: noteAtSemitone(root, st),
      role: ROLE_NAMES[i] ?? `+${st}半音`,
      semitones: st,
      color: ROLE_COLORS[i % ROLE_COLORS.length],
    }));
  }, [root, quality]);

  // 钢琴键盘显示
  const keyboardNotes = useMemo(() => {
    const baseSemitone = SEMITONE_MAP[root] ?? 0;
    return notes.map((n) => ({
      ...n,
      absoluteSemitone: (baseSemitone + n.semitones) % 12,
    }));
  }, [notes, root]);

  const isHighlighted = (semitone: number) =>
    keyboardNotes.some((n) => n.absoluteSemitone === semitone);

  const getHighlightColor = (semitone: number) =>
    keyboardNotes.find((n) => n.absoluteSemitone === semitone)?.color;

  return (
    <div className="bg-surface rounded-xl border border-surface-light p-4">
      <div className="text-sm font-bold mb-3">
        {root}{quality === "major" ? "大三和弦" : quality === "minor" ? "小三和弦" : quality === "dim" ? "减三和弦" : quality === "aug" ? "增三和弦" : quality === "maj7" ? "大七和弦" : quality === "dom7" ? "属七和弦" : quality === "min7" ? "小七和弦" : quality}
        构成
      </div>

      {/* 音符卡片 */}
      <div className="flex gap-3 mb-4">
        {notes.map((n, i) => (
          <div
            key={i}
            className="flex-1 text-center rounded-lg p-2"
            style={{ backgroundColor: `${n.color}20`, border: `1px solid ${n.color}40` }}
          >
            <div className="text-lg font-bold" style={{ color: n.color }}>
              {n.note}
            </div>
            <div className="text-xs text-text-muted">{n.role}</div>
            <div className="text-xs text-text-muted">
              {i === 0 ? "根音" : `+${n.semitones}半音`}
            </div>
          </div>
        ))}
      </div>

      {/* 迷你钢琴键盘 */}
      <div className="flex justify-center">
        <div className="flex relative">
          {NOTE_NAMES.map((note, i) => {
            const isBlack = note.includes("#");
            if (isBlack) return null;

            const highlighted = isHighlighted(i);
            const hColor = getHighlightColor(i);

            return (
              <div key={note} className="relative">
                <div
                  className={`w-8 h-20 rounded-b border border-gray-400 flex items-end justify-center pb-1 text-xs ${
                    highlighted
                      ? "text-white"
                      : "bg-white text-gray-800"
                  }`}
                  style={
                    highlighted
                      ? { backgroundColor: hColor }
                      : {}
                  }
                >
                  {note}
                </div>
                {/* 黑键 */}
                {["C", "D", "F", "G", "A"].includes(note) && (
                  <div
                    className={`absolute -top-0 left-[calc(100%-6px)] w-5 h-12 rounded-b z-10 flex items-end justify-center pb-0.5 text-[8px] ${
                      isHighlighted(i + 1)
                        ? "text-white"
                        : "bg-gray-900 text-gray-400"
                    }`}
                    style={
                      isHighlighted(i + 1)
                        ? { backgroundColor: getHighlightColor(i + 1) }
                        : {}
                    }
                  >
                    {NOTE_NAMES[i + 1]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 音程关系 */}
      <div className="mt-3 text-xs text-text-muted text-center">
        {notes.length >= 3 && (
          <span>
            根音→三音：{notes[1].semitones}半音（{notes[1].semitones === 4 ? "大三度" : notes[1].semitones === 3 ? "小三度" : ""}）
            {" | "}
            根音→五音：{notes[2].semitones}半音（{notes[2].semitones === 7 ? "纯五度" : notes[2].semitones === 6 ? "减五度" : notes[2].semitones === 8 ? "增五度" : ""}）
          </span>
        )}
      </div>
    </div>
  );
}
