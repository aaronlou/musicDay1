use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// 课程目录 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CourseCatalogDto {
    pub id: String,
    pub title: String,
    pub description: String,
    pub chapters: Vec<ChapterSummaryDto>,
}

/// 章节摘要 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChapterSummaryDto {
    pub id: String,
    pub title: String,
    pub description: String,
    pub icon: String,
    pub order: u32,
    pub lesson_count: usize,
    pub lessons: Vec<LessonSummaryDto>,
}

/// 课时摘要 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LessonSummaryDto {
    pub id: String,
    pub order: u32,
    pub title: String,
    pub subtitle: String,
    pub quiz_id: Option<String>,
    pub quiz_title: Option<String>,
}

/// 课程详情 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LessonDetailDto {
    pub id: String,
    pub chapter_id: String,
    pub chapter_title: String,
    pub order: u32,
    pub title: String,
    pub subtitle: String,
    pub content: Vec<String>,
    pub tips: Vec<String>,
    pub has_quiz: bool,
    pub quiz_id: Option<String>,
    pub quiz_title: Option<String>,
    pub quiz_question_count: Option<usize>,
}

/// 测验 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuizDto {
    pub id: String,
    pub title: String,
    pub questions: Vec<QuestionDto>,
}

/// 题目 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuestionDto {
    pub id: String,
    #[serde(rename = "type")]
    pub question_type: String,
    pub question: String,
    pub choices: Option<Vec<ChoiceDto>>,
    pub correct_answer: crate::domain::entities::Answer,
    pub explanation: String,
}

/// 选项 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChoiceDto {
    pub id: String,
    pub text: String,
}

/// 测验提交 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuizSubmissionDto {
    pub quiz_id: String,
    pub answers: Vec<QuestionAnswerDto>,
}

/// 单题答案 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuestionAnswerDto {
    pub question_id: String,
    pub answer: crate::domain::entities::Answer,
}

/// 测验结果 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuizResultDto {
    pub score: u32,
    pub total: u32,
    pub percentage: u32,
    pub passed: bool,
    pub explanations: Vec<QuestionExplanationDto>,
}

/// 题目解析 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuestionExplanationDto {
    pub question_id: String,
    pub correct: bool,
    pub explanation: String,
}

/// 用户进度 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProgressDto {
    pub completed_lessons: Vec<String>,
    pub completed_quizzes: Vec<String>,
    pub quiz_scores: HashMap<String, u32>,
    pub last_study_date: Option<String>,
    pub streak_days: u32,
    pub total_lessons: usize,
    pub lesson_completion_rate: u32,
    pub total_quizzes: usize,
    pub quiz_completion_rate: u32,
    pub average_score: u32,
}

/// 课程导航 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NavigationDto {
    pub prev_lesson_id: Option<String>,
    pub prev_lesson_title: Option<String>,
    pub next_lesson_id: Option<String>,
    pub next_lesson_title: Option<String>,
}

/// 课程可访问性 DTO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LessonAccessibilityDto {
    pub lesson_id: String,
    pub accessible: bool,
    pub completed: bool,
}

// ============ TTS DTOs ============

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TtsStatusDto {
    pub enabled: bool,
    pub current_voice: String,
    pub voices: Vec<VoiceOptionDto>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoiceOptionDto {
    pub id: String,
    pub name: String,
}
