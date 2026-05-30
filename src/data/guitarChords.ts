// 吉他标准调音：EADGBE（从6弦到1弦）
export const GUITAR_STRINGS = [
  { number: 6, note: "E", octave: 2, freq: 82.41 },
  { number: 5, note: "A", octave: 2, freq: 110.0 },
  { number: 4, note: "D", octave: 3, freq: 146.83 },
  { number: 3, note: "G", octave: 3, freq: 196.0 },
  { number: 2, note: "B", octave: 3, freq: 246.94 },
  { number: 1, note: "E", octave: 4, freq: 329.63 },
];

export interface GuitarChord {
  name: string;
  displayName: string;
  fullName: string;
  // 从6弦到1弦：-1=闷音(x), 0=空弦, 1+ = 按几品
  frets: number[];
  // 按弦手指（从6弦到1弦）：0=不按, 1=食指, 2=中指, 3=无名指, 4=小指
  fingers?: number[];
  // 和弦性质标签
  tags: string[];
}

// 按弦后频率 = 空弦频率 × 2^(品数/12)
export function getFretFreq(stringIndex: number, fret: number): number {
  const base = GUITAR_STRINGS[stringIndex].freq;
  if (fret <= 0) return base;
  return base * Math.pow(2, fret / 12);
}

export const COMMON_CHORDS: GuitarChord[] = [
  {
    name: "C",
    displayName: "C",
    fullName: "C大三和弦",
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    tags: ["大三", "常用", "C大调I级"],
  },
  {
    name: "G",
    displayName: "G",
    fullName: "G大三和弦",
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    tags: ["大三", "常用", "C大调V级"],
  },
  {
    name: "Am",
    displayName: "Am",
    fullName: "A小三和弦",
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    tags: ["小三", "常用", "C大调vi级"],
  },
  {
    name: "F",
    displayName: "F",
    fullName: "F大三和弦（大横按）",
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    tags: ["大三", "大横按", "C大调IV级"],
  },
  {
    name: "D",
    displayName: "D",
    fullName: "D大三和弦",
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
    tags: ["大三", "常用", "G大调V级"],
  },
  {
    name: "Em",
    displayName: "Em",
    fullName: "E小三和弦",
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    tags: ["小三", "常用", "G大调vi级"],
  },
  {
    name: "A",
    displayName: "A",
    fullName: "A大三和弦",
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    tags: ["大三", "常用", "D大调V级"],
  },
  {
    name: "E",
    displayName: "E",
    fullName: "E大三和弦",
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    tags: ["大三", "常用", "E大调I级"],
  },
  {
    name: "Dm",
    displayName: "Dm",
    fullName: "D小三和弦",
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1],
    tags: ["小三", "常用", "C大调ii级"],
  },
  {
    name: "G7",
    displayName: "G7",
    fullName: "G属七和弦",
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, 0, 0, 0, 1],
    tags: ["属七", "蓝调", "C大调V7级"],
  },
  {
    name: "C7",
    displayName: "C7",
    fullName: "C属七和弦",
    frets: [-1, 3, 2, 3, 1, 0],
    fingers: [0, 3, 2, 4, 1, 0],
    tags: ["属七", "蓝调", "F大调V7级"],
  },
  {
    name: "A7",
    displayName: "A7",
    fullName: "A属七和弦",
    frets: [-1, 0, 2, 0, 2, 0],
    fingers: [0, 0, 2, 0, 3, 0],
    tags: ["属七", "蓝调", "D大调V7级"],
  },
  {
    name: "E7",
    displayName: "E7",
    fullName: "E属七和弦",
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [0, 2, 0, 1, 0, 0],
    tags: ["属七", "蓝调", "A大调V7级"],
  },
  {
    name: "Bm",
    displayName: "Bm",
    fullName: "B小三和弦（大横按）",
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [0, 1, 3, 4, 2, 1],
    tags: ["小三", "大横按", "G大调iii级"],
  },
  {
    name: "B7",
    displayName: "B7",
    fullName: "B属七和弦",
    frets: [-1, 2, 1, 2, 0, 2],
    fingers: [0, 2, 1, 3, 0, 4],
    tags: ["属七", "蓝调", "E大调V7级"],
  },
  {
    name: "Dsus4",
    displayName: "Dsus4",
    fullName: "D挂留四和弦",
    frets: [-1, -1, 0, 2, 3, 3],
    fingers: [0, 0, 0, 1, 2, 3],
    tags: ["挂留", "民谣"],
  },
  {
    name: "Asus4",
    displayName: "Asus4",
    fullName: "A挂留四和弦",
    frets: [-1, 0, 2, 2, 3, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    tags: ["挂留", "民谣"],
  },
];

export interface ChordProgression {
  name: string;
  description: string;
  key: string;
  chords: string[];
}

export const CHORD_PROGRESSIONS: ChordProgression[] = [
  {
    name: "I - V - vi - IV",
    description: "流行金曲万能和弦进行",
    key: "C大调",
    chords: ["C", "G", "Am", "F"],
  },
  {
    name: "vi - IV - I - V",
    description: "抒情经典进行",
    key: "C大调",
    chords: ["Am", "F", "C", "G"],
  },
  {
    name: "I - IV - V",
    description: "蓝调/摇滚基础进行",
    key: "C大调",
    chords: ["C", "F", "G"],
  },
  {
    name: "I - V - IV",
    description: "朗朗上口的进行",
    key: "C大调",
    chords: ["C", "G", "F"],
  },
  {
    name: "ii - V - I",
    description: "爵士乐灵魂进行",
    key: "C大调",
    chords: ["Dm", "G7", "C"],
  },
  {
    name: "I - V - vi - iii - IV",
    description: "卡农变体进行",
    key: "C大调",
    chords: ["C", "G", "Am", "Em", "F"],
  },
  {
    name: "G调 I - V - vi - IV",
    description: "G大调经典进行",
    key: "G大调",
    chords: ["G", "D", "Em", "C"],
  },
];
