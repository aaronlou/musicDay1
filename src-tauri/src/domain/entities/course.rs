use serde::{Deserialize, Serialize};
use crate::domain::entities::quiz::Quiz;
use crate::domain::value_objects::ids::*;

/// 课程聚合根
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Course {
    pub id: CourseId,
    pub title: String,
    pub description: String,
    pub chapters: Vec<Chapter>,
}

impl Course {
    pub fn find_lesson(&self, lesson_id: &LessonId) -> Option<(&Chapter, &Lesson)> {
        self.chapters.iter().find_map(|ch| {
            ch.lessons
                .iter()
                .find(|l| l.id == *lesson_id)
                .map(|lesson| (ch, lesson))
        })
    }

    pub fn find_quiz(&self, quiz_id: &QuizId) -> Option<(&Chapter, &Lesson, &Quiz)> {
        self.chapters.iter().find_map(|ch| {
            ch.lessons.iter().find_map(|lesson| {
                lesson
                    .quiz
                    .as_ref()
                    .filter(|q| q.id == *quiz_id)
                    .map(|quiz| (ch, lesson, quiz))
            })
        })
    }

    pub fn find_next_lesson(&self, current_id: &LessonId) -> Option<&Lesson> {
        let all_lessons: Vec<&Lesson> = self
            .chapters
            .iter()
            .flat_map(|ch| ch.lessons.iter())
            .collect();
        let idx = all_lessons.iter().position(|l| l.id == *current_id)?;
        all_lessons.get(idx + 1).copied()
    }

    pub fn find_prev_lesson(&self, current_id: &LessonId) -> Option<&Lesson> {
        let all_lessons: Vec<&Lesson> = self
            .chapters
            .iter()
            .flat_map(|ch| ch.lessons.iter())
            .collect();
        let idx = all_lessons.iter().position(|l| l.id == *current_id)?;
        if idx > 0 {
            Some(all_lessons[idx - 1])
        } else {
            None
        }
    }

    pub fn all_lessons(&self) -> Vec<(&Chapter, &Lesson)> {
        self.chapters
            .iter()
            .flat_map(|ch| ch.lessons.iter().map(move |l| (ch, l)))
            .collect()
    }

    pub fn total_lessons(&self) -> usize {
        self.chapters.iter().map(|ch| ch.lessons.len()).sum()
    }

    pub fn total_quizzes(&self) -> usize {
        self.chapters
            .iter()
            .map(|ch| ch.lessons.iter().filter(|l| l.quiz.is_some()).count())
            .sum()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Chapter {
    pub id: ChapterId,
    pub title: String,
    pub description: String,
    pub icon: String,
    pub order: u32,
    pub lessons: Vec<Lesson>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Lesson {
    pub id: LessonId,
    pub order: u32,
    pub title: String,
    pub subtitle: String,
    pub content: Vec<String>,
    pub tips: Vec<String>,
    pub quiz: Option<Quiz>,
}
