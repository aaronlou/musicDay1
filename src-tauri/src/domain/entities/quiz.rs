use serde::{Deserialize, Serialize};
use crate::domain::value_objects::ids::*;
use crate::domain::value_objects::question_type::QuestionType;

/// 测验实体
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Quiz {
    pub id: QuizId,
    pub title: String,
    pub questions: Vec<Question>,
}

impl Quiz {
    pub fn find_question(&self, question_id: &QuestionId) -> Option<&Question> {
        self.questions.iter().find(|q| q.id == *question_id)
    }

    pub fn question_count(&self) -> usize {
        self.questions.len()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Question {
    pub id: QuestionId,
    #[serde(rename = "type")]
    pub question_type: QuestionType,
    pub question: String,
    pub choices: Option<Vec<Choice>>,
    #[serde(rename = "correctAnswer")]
    pub correct_answer: Answer,
    pub explanation: String,
}

impl Question {
    pub fn evaluate(&self, user_answer: &Answer) -> bool {
        self.correct_answer.matches(user_answer)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Choice {
    pub id: String,
    pub text: String,
}

/// 答案值对象（支持单选/多选/填空/判断）
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum Answer {
    Single(String),
    Multi(Vec<String>),
}

impl Answer {
    pub fn matches(&self, other: &Answer) -> bool {
        match (self, other) {
            (Answer::Single(a), Answer::Single(b)) => a == b,
            (Answer::Multi(a), Answer::Multi(b)) => {
                a.len() == b.len() && a.iter().all(|x| b.contains(x))
            }
            _ => false,
        }
    }
}
