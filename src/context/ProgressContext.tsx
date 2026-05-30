import { createContext, useContext, type ReactNode } from "react";
import { useAppData } from "@/hooks/useProgress";
import type { AppData } from "@/hooks/useProgress";
import type { QuizResultDto, UserProgressDto } from "@/api/types";

interface ProgressContextType extends AppData {
  refresh: () => Promise<void>;
  markLessonComplete: (lessonId: string) => Promise<UserProgressDto>;
  submitQuiz: (submission: {
    quiz_id: string;
    answers: { question_id: string; answer: string | string[] }[];
  }) => Promise<QuizResultDto>;
  resetProgress: () => Promise<void>;
  isLessonComplete: (lessonId: string) => boolean;
  isQuizComplete: (quizId: string) => boolean;
  getQuizScore: (quizId: string) => number;
  isLessonAccessible: (lessonId: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const appData = useAppData();

  return (
    <ProgressContext.Provider value={appData}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgressContext must be used within ProgressProvider");
  return ctx;
}
