use crate::domain::entities::*;
use crate::domain::errors::DomainError;
use crate::domain::value_objects::ids::*;

/// 课程仓库接口
///
/// 负责课程领域数据的读取访问。
/// 课程数据是静态的，因此只提供查询方法。
pub trait CourseRepository: Send + Sync {
    fn find_all(&self) -> Vec<Course>;

    fn find_by_id(&self, id: &CourseId) -> Option<Course>;

    fn find_lesson_by_id(&self, id: &LessonId) -> Option<(Course, Chapter, Lesson)>;

    fn find_quiz_by_id(&self, id: &QuizId) -> Option<(Course, Chapter, Lesson, Quiz)>;

    fn find_next_lesson(&self, current_id: &LessonId) -> Option<Lesson>;

    fn find_prev_lesson(&self, current_id: &LessonId) -> Option<Lesson>;

    fn get_all_lessons(&self) -> Vec<(Chapter, Lesson)>;

    fn total_lessons(&self) -> usize;

    fn total_quizzes(&self) -> usize;
}

/// 进度仓库接口
///
/// 负责用户学习进度的持久化。
pub trait ProgressRepository: Send + Sync {
    fn load(&self) -> Result<UserProgress, DomainError>;
    fn save(&self, progress: &UserProgress) -> Result<(), DomainError>;
}
