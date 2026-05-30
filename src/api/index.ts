import { invoke } from "@tauri-apps/api/core";
import type {
  CourseCatalogDto,
  LessonDetailDto,
  QuizDto,
  NavigationDto,
  UserProgressDto,
  LessonAccessibilityDto,
  QuizSubmissionDto,
  QuizResultDto,
  TtsStatusDto,
} from "./types";

export const getCourseCatalog = () =>
  invoke<CourseCatalogDto>("get_course_catalog");

export const getLessonDetail = (lessonId: string) =>
  invoke<LessonDetailDto>("get_lesson_detail", { lessonId });

export const getQuiz = (quizId: string) =>
  invoke<QuizDto>("get_quiz", { quizId });

export const getNavigation = (lessonId: string) =>
  invoke<NavigationDto>("get_navigation", { lessonId });

export const markLessonComplete = (lessonId: string) =>
  invoke<UserProgressDto>("mark_lesson_complete", { lessonId });

export const getUserProgress = () =>
  invoke<UserProgressDto>("get_user_progress");

export const getLessonAccessibility = () =>
  invoke<LessonAccessibilityDto[]>("get_lesson_accessibility");

export const submitQuiz = (submission: QuizSubmissionDto) =>
  invoke<QuizResultDto>("submit_quiz", { submission });

export const resetProgress = () => invoke<void>("reset_progress");

export const speakText = (text: string) => invoke<void>("speak_text", { text });
export const stopSpeech = () => invoke<void>("stop_speech");

export const getTtsStatus = () => invoke<TtsStatusDto>("get_tts_status");

export const updateTtsConfig = (config: {
  voice?: string;
  appid?: string;
  token?: string;
}) => invoke<TtsStatusDto>("update_tts_config", config);
