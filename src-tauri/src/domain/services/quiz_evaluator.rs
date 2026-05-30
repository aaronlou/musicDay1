use crate::domain::entities::{Answer, Quiz};
use crate::domain::value_objects::ids::QuestionId;
use crate::domain::value_objects::score::Score;

/// 测验评分领域服务
///
/// 封装评分逻辑，确保评分规则作为领域知识被统一管理。
pub struct QuizEvaluator;

impl QuizEvaluator {
    pub fn evaluate(quiz: &Quiz, answers: &[(QuestionId, Answer)]) -> Score {
        let correct = answers
            .iter()
            .filter(|(question_id, answer)| {
                quiz.find_question(question_id)
                    .map(|q| q.evaluate(answer))
                    .unwrap_or(false)
            })
            .count() as u32;

        Score::new(correct, quiz.question_count() as u32)
    }
}
