use std::sync::Arc;

use crate::application::dto::*;
use crate::domain::entities::Answer;
use crate::domain::value_objects::ids::{QuestionId, QuizId};
use crate::domain::errors::DomainError;
use crate::domain::repositories::{CourseRepository, ProgressRepository};
use crate::domain::services::quiz_evaluator::QuizEvaluator;

/// 测验应用服务
///
/// 协调测验相关的用例：获取测验、提交答案、返回评分结果。
pub struct QuizApplicationService {
    course_repo: Arc<dyn CourseRepository>,
    progress_repo: Arc<dyn ProgressRepository>,
}

impl QuizApplicationService {
    pub fn new(
        course_repo: Arc<dyn CourseRepository>,
        progress_repo: Arc<dyn ProgressRepository>,
    ) -> Self {
        Self {
            course_repo,
            progress_repo,
        }
    }

    pub fn submit_quiz(
        &self,
        submission: QuizSubmissionDto,
        lang: &str,
    ) -> Result<QuizResultDto, DomainError> {
        let quiz_id = QuizId::new(&submission.quiz_id);

        let (_, _, _, quiz) = self
            .course_repo
            .find_quiz_by_id(&quiz_id, lang)
            .ok_or_else(|| DomainError::QuizNotFound(submission.quiz_id.clone()))?;

        let answers: Vec<(QuestionId, Answer)> = submission
            .answers
            .into_iter()
            .map(|a| (QuestionId::new(a.question_id), a.answer))
            .collect();

        let score = QuizEvaluator::evaluate(&quiz, &answers);

        let explanations: Vec<QuestionExplanationDto> = answers
            .iter()
            .map(|(qid, ans)| {
                let question = quiz.find_question(qid);
                let correct = question.map(|q| q.evaluate(ans)).unwrap_or(false);
                QuestionExplanationDto {
                    question_id: qid.0.clone(),
                    correct,
                    explanation: question.map(|q| q.explanation.clone()).unwrap_or_default(),
                }
            })
            .collect();

        let result = QuizResultDto {
            score: score.correct,
            total: score.total,
            percentage: score.percentage(),
            passed: score.passed(),
            explanations,
        };

        // 持久化测验成绩
        let mut progress = self.progress_repo.load()?;
        progress.record_quiz_score(quiz_id, score.percentage());
        self.progress_repo.save(&progress)?;

        Ok(result)
    }
}
