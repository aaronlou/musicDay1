use std::fs;
use std::path::PathBuf;

use crate::domain::errors::DomainError;

/// 文件存储基础设施
///
/// 封装底层文件系统操作，为仓库提供统一的持久化接口。
pub struct FileStorage {
    base_dir: PathBuf,
}

impl FileStorage {
    pub fn new(base_dir: PathBuf) -> Self {
        Self { base_dir }
    }

    pub fn read_text(&self, relative_path: &str) -> Result<String, DomainError> {
        let path = self.base_dir.join(relative_path);
        if !path.exists() {
            return Err(DomainError::ResourceNotFound);
        }
        let content = fs::read_to_string(path)?;
        Ok(content)
    }

    pub fn write_text(&self, relative_path: &str, content: &str) -> Result<(), DomainError> {
        let path = self.base_dir.join(relative_path);
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }
        fs::write(path, content)?;
        Ok(())
    }

    pub fn exists(&self, relative_path: &str) -> bool {
        self.base_dir.join(relative_path).exists()
    }

    pub fn ensure_dir(&self) -> Result<(), DomainError> {
        fs::create_dir_all(&self.base_dir)?;
        Ok(())
    }
}
