// Backend DTO types (matching Rust DTOs)

export interface CourseCatalogDto {
  id: string;
  title: string;
  description: string;
  chapters: ChapterSummaryDto[];
}

export interface LessonSummaryDto {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  quiz_id: string | null;
  quiz_title: string | null;
}

export interface ChapterSummaryDto {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  lesson_count: number;
  lessons: LessonSummaryDto[];
}

export interface LessonDetailDto {
  id: string;
  chapter_id: string;
  chapter_title: string;
  order: number;
  title: string;
  subtitle: string;
  content: string[];
  tips: string[];
  has_quiz: boolean;
  quiz_id: string | null;
  quiz_title: string | null;
  quiz_question_count: number | null;
}

export interface QuizDto {
  id: string;
  title: string;
  questions: QuestionDto[];
}

export interface QuestionDto {
  id: string;
  type: string;
  question: string;
  choices: ChoiceDto[] | null;
  correct_answer: string | string[];
  explanation: string;
}

export interface ChoiceDto {
  id: string;
  text: string;
}

export interface QuizSubmissionDto {
  quiz_id: string;
  answers: QuestionAnswerDto[];
}

export interface QuestionAnswerDto {
  question_id: string;
  answer: string | string[];
}

export interface QuizResultDto {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  explanations: QuestionExplanationDto[];
}

export interface QuestionExplanationDto {
  question_id: string;
  correct: boolean;
  explanation: string;
}

export interface UserProgressDto {
  completed_lessons: string[];
  completed_quizzes: string[];
  quiz_scores: Record<string, number>;
  last_study_date: string | null;
  streak_days: number;
  total_lessons: number;
  lesson_completion_rate: number;
  total_quizzes: number;
  quiz_completion_rate: number;
  average_score: number;
}

export interface NavigationDto {
  prev_lesson_id: string | null;
  prev_lesson_title: string | null;
  next_lesson_id: string | null;
  next_lesson_title: string | null;
}

export interface LessonAccessibilityDto {
  lesson_id: string;
  accessible: boolean;
  completed: boolean;
}

// TTS DTOs

export interface TtsStatusDto {
  enabled: boolean;
  current_voice: string;
  voices: VoiceOptionDto[];
}

export interface VoiceOptionDto {
  id: string;
  name: string;
}

// Image Gen DTOs

export interface ImageGenStatusDto {
  enabled: boolean;
  backend: string;
  backends: ImageBackendOptionDto[];
}

export interface ImageBackendOptionDto {
  id: string;
  name: string;
}

export interface ImageGenResultDto {
  base64: string | null;
  width: number;
  height: number;
}
