export interface Choice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: "single" | "multi" | "truefalse" | "fillblank";
  question: string;
  choices?: Choice[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  tips: string[];
  quiz?: Quiz;
  order: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface Progress {
  completedLessons: string[];
  completedQuizzes: string[];
  quizScores: Record<string, number>;
  lastStudyDate: string;
  streakDays: number;
}
