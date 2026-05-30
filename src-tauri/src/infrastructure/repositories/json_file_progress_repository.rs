use std::sync::Mutex;

use crate::domain::entities::UserProgress;
use crate::domain::errors::DomainError;
use crate::domain::repositories::ProgressRepository;
use crate::infrastructure::persistence::file_storage::FileStorage;

const PROGRESS_FILE: &str = "user_progress.json";

/// JSON 文件进度仓库
///
/// 将用户进度序列化为 JSON 存储在本地文件系统中。
/// 使用 Mutex 保证并发安全。
pub struct JsonFileProgressRepository {
    storage: Mutex<FileStorage>,
}

impl JsonFileProgressRepository {
    pub fn new(storage: FileStorage) -> Self {
        let _ = storage.ensure_dir();
        Self {
            storage: Mutex::new(storage),
        }
    }
}

impl ProgressRepository for JsonFileProgressRepository {
    fn load(&self) -> Result<UserProgress, DomainError> {
        let storage = self.storage.lock().unwrap();
        if !storage.exists(PROGRESS_FILE) {
            return Ok(UserProgress::default());
        }
        let json = storage.read_text(PROGRESS_FILE)?;
        let progress: UserProgress = serde_json::from_str(&json)?;
        Ok(progress)
    }

    fn save(&self, progress: &UserProgress) -> Result<(), DomainError> {
        let storage = self.storage.lock().unwrap();
        let json = serde_json::to_string_pretty(progress)?;
        storage.write_text(PROGRESS_FILE, &json)?;
        Ok(())
    }
}
