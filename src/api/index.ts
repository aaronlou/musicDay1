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
  ImageGenStatusDto,
  ImageGenResultDto,
} from "./types";

export const getCourseCatalog = (lang: string) =>
  invoke<CourseCatalogDto>("get_course_catalog", { lang });

export const getLessonDetail = (lessonId: string, lang: string) =>
  invoke<LessonDetailDto>("get_lesson_detail", { lessonId, lang });

export const getQuiz = (quizId: string, lang: string) =>
  invoke<QuizDto>("get_quiz", { quizId, lang });

export const getNavigation = (lessonId: string, lang: string) =>
  invoke<NavigationDto>("get_navigation", { lessonId, lang });

export const markLessonComplete = (lessonId: string) =>
  invoke<UserProgressDto>("mark_lesson_complete", { lessonId });

export const getUserProgress = () =>
  invoke<UserProgressDto>("get_user_progress");

export const getLessonAccessibility = (lang: string) =>
  invoke<LessonAccessibilityDto[]>("get_lesson_accessibility", { lang });

export const submitQuiz = (submission: QuizSubmissionDto, lang: string) =>
  invoke<QuizResultDto>("submit_quiz", { submission, lang });

export const resetProgress = () => invoke<void>("reset_progress");

export const speakText = (text: string) => invoke<void>("speak_text", { text });
export const stopSpeech = () => invoke<void>("stop_speech");

export const getTtsStatus = () => invoke<TtsStatusDto>("get_tts_status");

export const updateTtsConfig = (config: {
  voice?: string;
  appid?: string;
  token?: string;
}) => invoke<TtsStatusDto>("update_tts_config", config);

export const getImageGenStatus = () =>
  invoke<ImageGenStatusDto>("get_image_gen_status");

export const updateImageGenConfig = (config: {
  backend?: string;
  api_key?: string;
}) => invoke<ImageGenStatusDto>("update_image_gen_config", config);

export const generateImage = (prompt: string, aspectRatio?: string) =>
  invoke<ImageGenResultDto>("generate_image", { prompt, aspectRatio });
