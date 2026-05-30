#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct Score {
    pub correct: u32,
    pub total: u32,
}

impl Score {
    pub fn new(correct: u32, total: u32) -> Self {
        Self { correct, total }
    }

    pub fn percentage(&self) -> u32 {
        if self.total == 0 {
            0
        } else {
            (self.correct * 100) / self.total
        }
    }

    pub fn passed(&self) -> bool {
        self.percentage() >= 60
    }
}

use serde::{Deserialize, Serialize};
