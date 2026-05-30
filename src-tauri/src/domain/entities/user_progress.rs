use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::domain::value_objects::ids::*;

/// 用户进度聚合根
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct UserProgress {
    completed_lessons: Vec<String>,
    completed_quizzes: Vec<String>,
    quiz_scores: HashMap<String, u32>,
    last_study_date: Option<String>,
    streak_days: u32,
}

impl UserProgress {
    pub fn is_lesson_completed(&self, lesson_id: &LessonId) -> bool {
        self.completed_lessons.contains(&lesson_id.0)
    }

    pub fn is_quiz_completed(&self, quiz_id: &QuizId) -> bool {
        self.completed_quizzes.contains(&quiz_id.0)
    }

    pub fn get_quiz_score(&self, quiz_id: &QuizId) -> Option<u32> {
        self.quiz_scores.get(&quiz_id.0).copied()
    }

    pub fn complete_lesson(&mut self, lesson_id: LessonId, today: NaiveDate) {
        if !self.is_lesson_completed(&lesson_id) {
            self.completed_lessons.push(lesson_id.0);
        }
        self.update_streak(today);
    }

    pub fn record_quiz_score(&mut self, quiz_id: QuizId, score: u32) {
        if !self.is_quiz_completed(&quiz_id) {
            self.completed_quizzes.push(quiz_id.0.clone());
        }
        self.quiz_scores.insert(quiz_id.0, score);
    }

    pub fn last_study_date(&self) -> Option<NaiveDate> {
        self.last_study_date
            .as_ref()
            .and_then(|d| NaiveDate::parse_from_str(d, "%Y-%m-%d").ok())
    }

    pub fn streak_days(&self) -> u32 {
        self.streak_days
    }

    pub fn completed_lessons(&self) -> &[String] {
        &self.completed_lessons
    }

    pub fn completed_quizzes(&self) -> &[String] {
        &self.completed_quizzes
    }

    pub fn quiz_scores(&self) -> &HashMap<String, u32> {
        &self.quiz_scores
    }

    fn update_streak(&mut self, today: NaiveDate) {
        let today_str = today.format("%Y-%m-%d").to_string();

        if let Some(last) = self.last_study_date() {
            let diff = (today - last).num_days();
            if diff == 1 {
                self.streak_days += 1;
            } else if diff > 1 {
                self.streak_days = 1;
            }
        } else {
            self.streak_days = 1;
        }

        self.last_study_date = Some(today_str);
    }
}
