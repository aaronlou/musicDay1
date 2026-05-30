use std::sync::Arc;

use crate::application::dto::*;
use crate::application::mappers::CourseMapper;
use crate::domain::errors::DomainError;
use crate::domain::repositories::CourseRepository;
use crate::domain::value_objects::ids::*;

/// 课程应用服务
///
/// 协调课程相关的用例，负责将领域模型转换为 DTO。
pub struct CourseApplicationService {
    course_repo: Arc<dyn CourseRepository>,
}

impl CourseApplicationService {
    pub fn new(course_repo: Arc<dyn CourseRepository>) -> Self {
        Self { course_repo }
    }

    pub fn get_course_catalog(&self) -> CourseCatalogDto {
        let courses = self.course_repo.find_all();
        let course = courses.into_iter().next().expect("No course data available");
        CourseMapper::to_catalog_dto(course)
    }

    pub fn get_lesson_detail(&self, lesson_id: &str) -> Result<LessonDetailDto, DomainError> {
        let id = LessonId::new(lesson_id);
        self.course_repo
            .find_lesson_by_id(&id)
            .map(|(course, chapter, lesson)| {
                CourseMapper::to_lesson_detail_dto(course, chapter, lesson)
            })
            .ok_or_else(|| DomainError::LessonNotFound(lesson_id.to_string()))
    }

    pub fn get_quiz(&self, quiz_id: &str) -> Result<QuizDto, DomainError> {
        let id = QuizId::new(quiz_id);
        self.course_repo
            .find_quiz_by_id(&id)
            .map(|(_, _, _, quiz)| CourseMapper::to_quiz_dto(quiz))
            .ok_or_else(|| DomainError::QuizNotFound(quiz_id.to_string()))
    }

    pub fn get_navigation(&self, lesson_id: &str) -> NavigationDto {
        let id = LessonId::new(lesson_id);
        let prev = self.course_repo.find_prev_lesson(&id);
        let next = self.course_repo.find_next_lesson(&id);
        NavigationDto {
            prev_lesson_id: prev.as_ref().map(|l| l.id.0.clone()),
            prev_lesson_title: prev.as_ref().map(|l| l.title.clone()),
            next_lesson_id: next.as_ref().map(|l| l.id.0.clone()),
            next_lesson_title: next.as_ref().map(|l| l.title.clone()),
        }
    }
}
