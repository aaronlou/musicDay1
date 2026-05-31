use crate::domain::entities::*;
use crate::domain::errors::DomainError;
use crate::domain::value_objects::ids::*;

/// 课程仓库接口
///
/// 负责课程领域数据的读取访问。
/// 课程数据是静态的，因此只提供查询方法。
/// 所有方法接受 lang 参数以支持中英文切换。
pub trait CourseRepository: Send + Sync {
    fn find_all(&self, lang: &str) -> Vec<Course>;

    fn find_by_id(&self, id: &CourseId, lang: &str) -> Option<Course>;

    fn find_lesson_by_id(&self, id: &LessonId, lang: &str) -> Option<(Course, Chapter, Lesson)>;

    fn find_quiz_by_id(&self, id: &QuizId, lang: &str) -> Option<(Course, Chapter, Lesson, Quiz)>;

    fn find_next_lesson(&self, current_id: &LessonId, lang: &str) -> Option<Lesson>;

    fn find_prev_lesson(&self, current_id: &LessonId, lang: &str) -> Option<Lesson>;

    fn get_all_lessons(&self, lang: &str) -> Vec<(Chapter, Lesson)>;

    fn total_lessons(&self, lang: &str) -> usize;

    fn total_quizzes(&self, lang: &str) -> usize;
}

/// 进度仓库接口
///
/// 负责用户学习进度的持久化。
pub trait ProgressRepository: Send + Sync {
    fn load(&self) -> Result<UserProgress, DomainError>;
    fn save(&self, progress: &UserProgress) -> Result<(), DomainError>;
}
