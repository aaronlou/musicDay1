use crate::application::dto::*;
use crate::domain::entities::*;

pub struct CourseMapper;

impl CourseMapper {
    pub fn to_catalog_dto(course: Course) -> CourseCatalogDto {
        CourseCatalogDto {
            id: course.id.0,
            title: course.title,
            description: course.description,
            chapters: course
                .chapters
                .into_iter()
                .map(|ch| ChapterSummaryDto {
                    id: ch.id.0,
                    title: ch.title,
                    description: ch.description,
                    icon: ch.icon,
                    order: ch.order,
                    lesson_count: ch.lessons.len(),
                    lessons: ch.lessons.into_iter().map(|l| LessonSummaryDto {
                        id: l.id.0,
                        order: l.order,
                        title: l.title,
                        subtitle: l.subtitle,
                        quiz_id: l.quiz.as_ref().map(|q| q.id.0.clone()),
                        quiz_title: l.quiz.as_ref().map(|q| q.title.clone()),
                    }).collect(),
                })
                .collect(),
        }
    }

    pub fn to_lesson_detail_dto(
        _course: Course,
        chapter: Chapter,
        lesson: Lesson,
    ) -> LessonDetailDto {
        let has_quiz = lesson.quiz.is_some();
        let quiz_id = lesson.quiz.as_ref().map(|q| q.id.0.clone());
        let quiz_title = lesson.quiz.as_ref().map(|q| q.title.clone());
        let quiz_question_count = lesson.quiz.as_ref().map(|q| q.question_count());

        LessonDetailDto {
            id: lesson.id.0,
            chapter_id: chapter.id.0,
            chapter_title: chapter.title,
            order: lesson.order,
            title: lesson.title,
            subtitle: lesson.subtitle,
            content: lesson.content,
            tips: lesson.tips,
            has_quiz,
            quiz_id,
            quiz_title,
            quiz_question_count,
        }
    }

    pub fn to_quiz_dto(quiz: Quiz) -> QuizDto {
        QuizDto {
            id: quiz.id.0,
            title: quiz.title,
            questions: quiz
                .questions
                .into_iter()
                .map(|q| QuestionDto {
                    id: q.id.0,
                    question_type: q.question_type.as_str().to_string(),
                    question: q.question,
                    choices: q.choices.map(|choices| {
                        choices
                            .into_iter()
                            .map(|c| ChoiceDto {
                                id: c.id,
                                text: c.text,
                            })
                            .collect()
                    }),
                    correct_answer: q.correct_answer,
                    explanation: q.explanation,
                })
                .collect(),
        }
    }
}

pub struct ProgressMapper;

impl ProgressMapper {
    pub fn to_dto(
        progress: UserProgress,
        total_lessons: usize,
        total_quizzes: usize,
    ) -> UserProgressDto {
        let completed_lessons = progress.completed_lessons().to_vec();
        let completed_quizzes = progress.completed_quizzes().to_vec();
        let quiz_scores = progress.quiz_scores().clone();

        let lesson_completion_rate = if total_lessons > 0 {
            (completed_lessons.len() as u32) * 100 / (total_lessons as u32)
        } else {
            0
        };

        let quiz_completion_rate = if total_quizzes > 0 {
            (completed_quizzes.len() as u32) * 100 / (total_quizzes as u32)
        } else {
            0
        };

        let average_score = if !quiz_scores.is_empty() {
            quiz_scores.values().sum::<u32>() / (quiz_scores.len() as u32)
        } else {
            0
        };

        UserProgressDto {
            completed_lessons,
            completed_quizzes,
            quiz_scores,
            last_study_date: progress.last_study_date().map(|d| d.to_string()),
            streak_days: progress.streak_days(),
            total_lessons,
            lesson_completion_rate,
            total_quizzes,
            quiz_completion_rate,
            average_score,
        }
    }
}
