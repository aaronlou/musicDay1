use std::sync::Arc;

use chrono::Local;

use crate::application::dto::*;
use crate::application::mappers::ProgressMapper;
use crate::domain::errors::DomainError;
use crate::domain::repositories::{CourseRepository, ProgressRepository};
use crate::domain::value_objects::ids::LessonId;

/// 学习应用服务
///
/// 协调学习进度相关的用例：标记完成、获取进度、计算统计等。
pub struct LearningApplicationService {
    course_repo: Arc<dyn CourseRepository>,
    progress_repo: Arc<dyn ProgressRepository>,
}

impl LearningApplicationService {
    pub fn new(
        course_repo: Arc<dyn CourseRepository>,
        progress_repo: Arc<dyn ProgressRepository>,
    ) -> Self {
        Self {
            course_repo,
            progress_repo,
        }
    }

    pub fn mark_lesson_complete(
        &self,
        lesson_id: &str,
    ) -> Result<UserProgressDto, DomainError> {
        let mut progress = self.progress_repo.load()?;
        let id = LessonId::new(lesson_id);
        let today = Local::now().naive_local().date();
        progress.complete_lesson(id, today);
        self.progress_repo.save(&progress)?;
        Ok(self.build_progress_dto(progress))
    }

    pub fn get_progress(&self) -> Result<UserProgressDto, DomainError> {
        let progress = self.progress_repo.load()?;
        Ok(self.build_progress_dto(progress))
    }

    pub fn reset_progress(&self) -> Result<(), DomainError> {
        use crate::domain::entities::UserProgress;
        let progress = UserProgress::default();
        self.progress_repo.save(&progress)
    }

    pub fn get_lesson_accessibility(
        &self,
    ) -> Result<Vec<LessonAccessibilityDto>, DomainError> {
        let progress = self.progress_repo.load()?;
        let all_lessons = self.course_repo.get_all_lessons();
        let mut result = Vec::new();
        let mut prev_completed = true;

        for (_, lesson) in all_lessons {
            let completed = progress.is_lesson_completed(&lesson.id);
            let accessible = prev_completed;
            result.push(LessonAccessibilityDto {
                lesson_id: lesson.id.0.clone(),
                accessible,
                completed,
            });
            prev_completed = completed;
        }

        Ok(result)
    }

    fn build_progress_dto(&self, progress: crate::domain::entities::UserProgress) -> UserProgressDto {
        ProgressMapper::to_dto(
            progress,
            self.course_repo.total_lessons(),
            self.course_repo.total_quizzes(),
        )
    }
}
