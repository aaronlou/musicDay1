use thiserror::Error;

#[derive(Error, Debug)]
pub enum DomainError {
    #[error("Course not found: {0}")]
    CourseNotFound(String),

    #[error("Lesson not found: {0}")]
    LessonNotFound(String),

    #[error("Quiz not found: {0}")]
    QuizNotFound(String),

    #[error("Invalid answer format")]
    InvalidAnswerFormat,

    #[error("Persistence error: {0}")]
    PersistenceError(String),

    #[error("Serialization error: {0}")]
    SerializationError(String),

    #[error("Resource not found")]
    ResourceNotFound,
}

impl From<std::io::Error> for DomainError {
    fn from(err: std::io::Error) -> Self {
        DomainError::PersistenceError(err.to_string())
    }
}

impl From<serde_json::Error> for DomainError {
    fn from(err: serde_json::Error) -> Self {
        DomainError::SerializationError(err.to_string())
    }
}
