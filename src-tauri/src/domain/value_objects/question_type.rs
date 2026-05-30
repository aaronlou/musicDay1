use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum QuestionType {
    Single,
    Multi,
    #[serde(rename = "truefalse")]
    TrueFalse,
    #[serde(rename = "fillblank")]
    FillBlank,
}

impl QuestionType {
    pub fn as_str(&self) -> &'static str {
        match self {
            QuestionType::Single => "single",
            QuestionType::Multi => "multi",
            QuestionType::TrueFalse => "truefalse",
            QuestionType::FillBlank => "fillblank",
        }
    }
}
