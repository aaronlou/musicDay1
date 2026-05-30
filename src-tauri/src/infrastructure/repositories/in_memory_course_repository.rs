use std::sync::Mutex;

use once_cell::sync::Lazy;

use crate::domain::entities::*;
use crate::domain::repositories::CourseRepository;
use crate::domain::value_objects::ids::*;

static COURSE_DATA: Lazy<Mutex<Vec<Course>>> = Lazy::new(|| {
    let json = include_str!("../../../resources/courses.json");
    let course: Course = serde_json::from_str(json).expect("Failed to parse courses.json");
    Mutex::new(vec![course])
});

/// 内存课程仓库
///
/// 课程数据是静态的，在编译时通过 `include_str!` 嵌入，运行时加载到内存中。
/// 提供只读访问，保证高并发性能。
pub struct InMemoryCourseRepository;

impl InMemoryCourseRepository {
    pub fn new() -> Self {
        // 触发静态初始化
        let _guard = COURSE_DATA.lock().unwrap();
        Self
    }

    fn with_courses<T>(&self, f: impl FnOnce(&[Course]) -> T) -> T {
        let courses = COURSE_DATA.lock().unwrap();
        f(&courses)
    }
}

impl Default for InMemoryCourseRepository {
    fn default() -> Self {
        Self::new()
    }
}

impl CourseRepository for InMemoryCourseRepository {
    fn find_all(&self) -> Vec<Course> {
        self.with_courses(|courses| courses.to_vec())
    }

    fn find_by_id(&self, id: &CourseId) -> Option<Course> {
        self.with_courses(|courses| {
            courses.iter().find(|c| c.id == *id).cloned()
        })
    }

    fn find_lesson_by_id(&self, id: &LessonId) -> Option<(Course, Chapter, Lesson)> {
        self.with_courses(|courses| {
            courses.iter().find_map(|course| {
                course.find_lesson(id).map(|(ch, lesson)| {
                    (course.clone(), ch.clone(), lesson.clone())
                })
            })
        })
    }

    fn find_quiz_by_id(&self, id: &QuizId) -> Option<(Course, Chapter, Lesson, Quiz)> {
        self.with_courses(|courses| {
            courses.iter().find_map(|course| {
                course.find_quiz(id).map(|(ch, lesson, quiz)| {
                    (course.clone(), ch.clone(), lesson.clone(), quiz.clone())
                })
            })
        })
    }

    fn find_next_lesson(&self, current_id: &LessonId) -> Option<Lesson> {
        self.with_courses(|courses| {
            courses.iter().find_map(|c| c.find_next_lesson(current_id)).cloned()
        })
    }

    fn find_prev_lesson(&self, current_id: &LessonId) -> Option<Lesson> {
        self.with_courses(|courses| {
            courses.iter().find_map(|c| c.find_prev_lesson(current_id)).cloned()
        })
    }

    fn get_all_lessons(&self) -> Vec<(Chapter, Lesson)> {
        self.with_courses(|courses| {
            courses.iter().flat_map(|c| c.all_lessons().into_iter().map(|(ch, l)| (ch.clone(), l.clone()))).collect()
        })
    }

    fn total_lessons(&self) -> usize {
        self.with_courses(|courses| courses.iter().map(|c| c.total_lessons()).sum())
    }

    fn total_quizzes(&self) -> usize {
        self.with_courses(|courses| courses.iter().map(|c| c.total_quizzes()).sum())
    }
}
