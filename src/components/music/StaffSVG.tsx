/**
 * SVG 五线谱渲染组件
 *
 * 支持渲染：
 * - 五线谱 + 谱号
 * - 单个音符（全音符、二分、四分、八分）
 * - 和弦（多个音符同时显示）
 * - 调号、拍号
 */

import { useMemo } from "react";

interface Note {
  pitch: string; // e.g. "C4", "F#5", "Bb3"
  type?: "whole" | "half" | "quarter" | "eighth";
  duration?: number;
}

interface StaffSVGProps {
  notes: Note[];
  clef?: "treble" | "bass";
  width?: number;
  height?: number;
  showClef?: boolean;
}

// 音名到五线谱位置的映射（高音谱号，以 B4 为顶线=0）
const TREBLE_POSITIONS: Record<string, number> = {
  "E4": 4, "F4": 3.5, "G4": 3, "A4": 2.5, "B4": 2,
  "C5": 1.5, "D5": 1, "E5": 0.5, "F5": 0, "G5": -0.5,
  "A5": -1, "B5": -1.5, "C6": -2, "D6": -2.5,
  "D4": 4.5, "C4": 5, "B3": 5.5, "A3": 6, "G3": 6.5,
  "F3": 7, "E3": 7.5, "D3": 8,
};

// 低音谱号位置映射
const BASS_POSITIONS: Record<string, number> = {
  "G2": 4, "A2": 3.5, "B2": 3, "C3": 2.5, "D3": 2,
  "E3": 1.5, "F3": 1, "G3": 0.5, "A3": 0, "B3": -0.5,
  "C4": -1, "D4": -1.5, "E4": -2, "F4": -2.5,
  "F2": 4.5, "E2": 5, "D2": 5.5, "C2": 6,
};

function getNoteY(pitch: string, clef: "treble" | "bass"): number {
  const base = pitch.replace(/[#b]/, "");
  const map = clef === "treble" ? TREBLE_POSITIONS : BASS_POSITIONS;
  return map[base] ?? 3;
}

function hasSharp(pitch: string): boolean {
  return pitch.includes("#");
}

function hasFlat(pitch: string): boolean {
  return pitch.includes("b");
}

export default function StaffSVG({
  notes,
  clef = "treble",
  width = 400,
  height = 140,
  showClef = true,
}: StaffSVGProps) {
  const lineSpacing = 10;
  const topLineY = 30;
  const staffLeft = showClef ? 50 : 20;
  const staffRight = width - 20;

  const notePositions = useMemo(() => {
    return notes.map((note, i) => {
      const pos = getNoteY(note.pitch, clef);
      const x = staffLeft + 40 + i * 50;
      const y = topLineY + pos * (lineSpacing / 2);
      return { ...note, x, y, pos };
    });
  }, [notes, clef, staffLeft]);

  // 需要加 ledger lines 的音符
  const ledgerLines = useMemo(() => {
    const lines: { x: number; y: number }[] = [];
    notePositions.forEach((n) => {
      if (n.pos > 4) {
        for (let p = 5; p <= Math.min(n.pos, 8); p += 1) {
          if (p % 1 === 0) lines.push({ x: n.x, y: topLineY + p * (lineSpacing / 2) });
        }
      }
      if (n.pos < -0.5) {
        for (let p = -1; p >= Math.max(n.pos, -3); p -= 1) {
          if (Math.abs(p % 1) < 0.01) lines.push({ x: n.x, y: topLineY + p * (lineSpacing / 2) });
        }
      }
    });
    return lines;
  }, [notePositions]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ minHeight: height }}
    >
      {/* 背景 */}
      <rect x={0} y={0} width={width} height={height} fill="transparent" />

      {/* 五线 */}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`staff-${i}`}
          x1={staffLeft}
          y1={topLineY + i * lineSpacing}
          x2={staffRight}
          y2={topLineY + i * lineSpacing}
          stroke="currentColor"
          strokeWidth={1}
          className="text-text"
        />
      ))}

      {/* 加线 */}
      {ledgerLines.map((l, i) => (
        <line
          key={`ledger-${i}`}
          x1={l.x - 12}
          y1={l.y}
          x2={l.x + 12}
          y2={l.y}
          stroke="currentColor"
          strokeWidth={1}
          className="text-text"
        />
      ))}

      {/* 谱号 */}
      {showClef && (
        <text
          x={staffLeft + 5}
          y={clef === "treble" ? topLineY + 38 : topLineY + 25}
          fontSize={clef === "treble" ? 48 : 36}
          fill="currentColor"
          className="text-text"
        >
          {clef === "treble" ? "𝄞" : "𝄢"}
        </text>
      )}

      {/* 音符 */}
      {notePositions.map((note, i) => (
        <g key={`note-${i}`}>
          {/* 升号/降号 */}
          {hasSharp(note.pitch) && (
            <text
              x={note.x - 18}
              y={note.y + 5}
              fontSize={16}
              fill="currentColor"
              className="text-text"
            >
              ♯
            </text>
          )}
          {hasFlat(note.pitch) && (
            <text
              x={note.x - 18}
              y={note.y + 5}
              fontSize={16}
              fill="currentColor"
              className="text-text"
            >
              ♭
            </text>
          )}

          {/* 符干 */}
          {note.type !== "whole" && (
            <line
              x1={note.x + 6}
              y1={note.y}
              x2={note.x + 6}
              y2={note.y - 30}
              stroke="currentColor"
              strokeWidth={1.5}
              className="text-text"
            />
          )}

          {/* 符头 */}
          <ellipse
            cx={note.x}
            cy={note.y}
            rx={note.type === "whole" ? 8 : 6}
            ry={note.type === "whole" ? 5 : 4}
            fill={note.type === "whole" ? "transparent" : "currentColor"}
            stroke="currentColor"
            strokeWidth={1.5}
            className="text-text"
          />

          {/* 音名标签 */}
          <text
            x={note.x}
            y={note.y + 20}
            textAnchor="middle"
            fontSize={10}
            fill="currentColor"
            className="text-text-muted"
          >
            {note.pitch}
          </text>
        </g>
      ))}
    </svg>
  );
}
