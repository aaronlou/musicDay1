import { useState, useEffect, useCallback } from "react";
import type { CourseCatalogDto, UserProgressDto, LessonAccessibilityDto } from "@/api/types";
import {
  getCourseCatalog,
  getUserProgress,
  getLessonAccessibility,
  markLessonComplete as apiMarkLessonComplete,
  submitQuiz as apiSubmitQuiz,
  resetProgress as apiResetProgress,
} from "@/api";

export interface AppData {
  courseCatalog: CourseCatalogDto | null;
  progress: UserProgressDto | null;
  accessibility: LessonAccessibilityDto[] | null;
  loading: boolean;
  error: string | null;
}

export function useAppData() {
  const [data, setData] = useState<AppData>({
    courseCatalog: null,
    progress: null,
    accessibility: null,
    loading: true,
    error: null,
  });

  const loadAll = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [catalog, progress, accessibility] = await Promise.all([
        getCourseCatalog(),
        getUserProgress(),
        getLessonAccessibility(),
      ]);
      setData({
        courseCatalog: catalog,
        progress,
        accessibility,
        loading: false,
        error: null,
      });
    } catch (err) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : String(err),
      }));
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const markLessonComplete = useCallback(
    async (lessonId: string) => {
      const progress = await apiMarkLessonComplete(lessonId);
      const accessibility = await getLessonAccessibility();
      setData((prev) => ({ ...prev, progress, accessibility }));
      return progress;
    },
    []
  );

  const submitQuiz = useCallback(
    async (submission: { quiz_id: string; answers: { question_id: string; answer: string | string[] }[] }) => {
      const result = await apiSubmitQuiz(submission);
      const [progress, accessibility] = await Promise.all([
        getUserProgress(),
        getLessonAccessibility(),
      ]);
      setData((prev) => ({ ...prev, progress, accessibility }));
      return result;
    },
    []
  );

  const resetProgress = useCallback(async () => {
    await apiResetProgress();
    const [progress, accessibility] = await Promise.all([
      getUserProgress(),
      getLessonAccessibility(),
    ]);
    setData((prev) => ({ ...prev, progress, accessibility }));
  }, []);

  const isLessonComplete = useCallback(
    (lessonId: string) =>
      data.progress?.completed_lessons.includes(lessonId) ?? false,
    [data.progress]
  );

  const isQuizComplete = useCallback(
    (quizId: string) =>
      data.progress?.completed_quizzes.includes(quizId) ?? false,
    [data.progress]
  );

  const getQuizScore = useCallback(
    (quizId: string) => data.progress?.quiz_scores[quizId] ?? 0,
    [data.progress]
  );

  const isLessonAccessible = useCallback(
    (lessonId: string) =>
      data.accessibility?.find((a) => a.lesson_id === lessonId)?.accessible ??
      false,
    [data.accessibility]
  );

  return {
    ...data,
    refresh: loadAll,
    markLessonComplete,
    submitQuiz,
    resetProgress,
    isLessonComplete,
    isQuizComplete,
    getQuizScore,
    isLessonAccessible,
  };
}
