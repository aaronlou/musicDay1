use std::sync::Mutex;

use once_cell::sync::Lazy;

use crate::domain::entities::*;
use crate::domain::repositories::CourseRepository;
use crate::domain::value_objects::ids::*;

static COURSE_DATA_ZH: Lazy<Mutex<Vec<Course>>> = Lazy::new(|| {
    let json = include_str!("../../../resources/courses.json");
    let course: Course = serde_json::from_str(json).expect("Failed to parse courses.json");
    Mutex::new(vec![course])
});

static COURSE_DATA_EN: Lazy<Mutex<Vec<Course>>> = Lazy::new(|| {
    let json = include_str!("../../../resources/courses.en.json");
    let course: Course = serde_json::from_str(json).expect("Failed to parse courses.en.json");
    Mutex::new(vec![course])
});

fn get_courses(lang: &str) -> &'static Lazy<Mutex<Vec<Course>>> {
    match lang {
        "en" => &COURSE_DATA_EN,
        _ => &COURSE_DATA_ZH,
    }
}

/// 内存课程仓库
///
/// 课程数据是静态的，在编译时通过 `include_str!` 嵌入，运行时加载到内存中。
/// 提供只读访问，支持中英文切换，保证高并发性能。
pub struct InMemoryCourseRepository;

impl InMemoryCourseRepository {
    pub fn new() -> Self {
        // 触发静态初始化
        let _guard = COURSE_DATA_ZH.lock().unwrap();
        let _guard_en = COURSE_DATA_EN.lock().unwrap();
        Self
    }

    fn with_courses<T>(&self, lang: &str, f: impl FnOnce(&[Course]) -> T) -> T {
        let courses = get_courses(lang).lock().unwrap();
        f(&courses)
    }
}

impl Default for InMemoryCourseRepository {
    fn default() -> Self {
        Self::new()
    }
}

impl CourseRepository for InMemoryCourseRepository {
    fn find_all(&self, lang: &str) -> Vec<Course> {
        self.with_courses(lang, |courses| courses.to_vec())
    }

    fn find_by_id(&self, id: &CourseId, lang: &str) -> Option<Course> {
        self.with_courses(lang, |courses| {
            courses.iter().find(|c| c.id == *id).cloned()
        })
    }

    fn find_lesson_by_id(&self, id: &LessonId, lang: &str) -> Option<(Course, Chapter, Lesson)> {
        self.with_courses(lang, |courses| {
            courses.iter().find_map(|course| {
                course.find_lesson(id).map(|(ch, lesson)| {
                    (course.clone(), ch.clone(), lesson.clone())
                })
            })
        })
    }

    fn find_quiz_by_id(&self, id: &QuizId, lang: &str) -> Option<(Course, Chapter, Lesson, Quiz)> {
        self.with_courses(lang, |courses| {
            courses.iter().find_map(|course| {
                course.find_quiz(id).map(|(ch, lesson, quiz)| {
                    (course.clone(), ch.clone(), lesson.clone(), quiz.clone())
                })
            })
        })
    }

    fn find_next_lesson(&self, current_id: &LessonId, lang: &str) -> Option<Lesson> {
        self.with_courses(lang, |courses| {
            courses.iter().find_map(|c| c.find_next_lesson(current_id)).cloned()
        })
    }

    fn find_prev_lesson(&self, current_id: &LessonId, lang: &str) -> Option<Lesson> {
        self.with_courses(lang, |courses| {
            courses.iter().find_map(|c| c.find_prev_lesson(current_id)).cloned()
        })
    }

    fn get_all_lessons(&self, lang: &str) -> Vec<(Chapter, Lesson)> {
        self.with_courses(lang, |courses| {
            courses.iter().flat_map(|c| c.all_lessons().into_iter().map(|(ch, l)| (ch.clone(), l.clone()))).collect()
        })
    }

    fn total_lessons(&self, lang: &str) -> usize {
        self.with_courses(lang, |courses| courses.iter().map(|c| c.total_lessons()).sum())
    }

    fn total_quizzes(&self, lang: &str) -> usize {
        self.with_courses(lang, |courses| courses.iter().map(|c| c.total_quizzes()).sum())
    }
}
