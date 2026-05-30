use std::process::{Command, Stdio};
use std::sync::{Arc, Mutex};
use std::sync::OnceLock;

use tauri::State;

use crate::application::dto::*;
use crate::application::services::course_application_service::CourseApplicationService;
use crate::application::services::learning_application_service::LearningApplicationService;
use crate::application::services::quiz_application_service::QuizApplicationService;
use crate::domain::repositories::{CourseRepository, ProgressRepository};
use crate::infrastructure::persistence::file_storage::FileStorage;
use crate::infrastructure::repositories::in_memory_course_repository::InMemoryCourseRepository;
use crate::infrastructure::repositories::json_file_progress_repository::JsonFileProgressRepository;
use crate::infrastructure::image;
use crate::infrastructure::tts::{VolcanoTts, VOLCANO_VOICES};

// ============ Application Service Container ============

pub struct AppState {
    pub course_service: CourseApplicationService,
    pub learning_service: LearningApplicationService,
    pub quiz_service: QuizApplicationService,
}

impl AppState {
    pub fn new(app_data_dir: std::path::PathBuf) -> Self {
        let course_repo: Arc<dyn CourseRepository> =
            Arc::new(InMemoryCourseRepository::new());

        let storage = FileStorage::new(app_data_dir);
        let progress_repo: Arc<dyn ProgressRepository> =
            Arc::new(JsonFileProgressRepository::new(storage));

        Self {
            course_service: CourseApplicationService::new(course_repo.clone()),
            learning_service: LearningApplicationService::new(course_repo.clone(), progress_repo.clone()),
            quiz_service: QuizApplicationService::new(course_repo, progress_repo),
        }
    }
}

// ============ Tauri Commands ============

#[tauri::command]
pub fn get_course_catalog(state: State<'_, AppState>) -> Result<CourseCatalogDto, String> {
    Ok(state.course_service.get_course_catalog())
}

#[tauri::command]
pub fn get_lesson_detail(
    state: State<'_, AppState>,
    lesson_id: String,
) -> Result<LessonDetailDto, String> {
    state
        .course_service
        .get_lesson_detail(&lesson_id)
        .map_err(|e: crate::domain::errors::DomainError| e.to_string())
}

#[tauri::command]
pub fn get_quiz(state: State<'_, AppState>, quiz_id: String) -> Result<QuizDto, String> {
    state
        .course_service
        .get_quiz(&quiz_id)
        .map_err(|e: crate::domain::errors::DomainError| e.to_string())
}

#[tauri::command]
pub fn get_navigation(
    state: State<'_, AppState>,
    lesson_id: String,
) -> Result<NavigationDto, String> {
    Ok(state.course_service.get_navigation(&lesson_id))
}

#[tauri::command]
pub fn mark_lesson_complete(
    state: State<'_, AppState>,
    lesson_id: String,
) -> Result<UserProgressDto, String> {
    state
        .learning_service
        .mark_lesson_complete(&lesson_id)
        .map_err(|e: crate::domain::errors::DomainError| e.to_string())
}

#[tauri::command]
pub fn get_user_progress(state: State<'_, AppState>) -> Result<UserProgressDto, String> {
    state
        .learning_service
        .get_progress()
        .map_err(|e: crate::domain::errors::DomainError| e.to_string())
}

#[tauri::command]
pub fn get_lesson_accessibility(
    state: State<'_, AppState>,
) -> Result<Vec<LessonAccessibilityDto>, String> {
    state
        .learning_service
        .get_lesson_accessibility()
        .map_err(|e: crate::domain::errors::DomainError| e.to_string())
}

#[tauri::command]
pub fn submit_quiz(
    state: State<'_, AppState>,
    submission: QuizSubmissionDto,
) -> Result<QuizResultDto, String> {
    state
        .quiz_service
        .submit_quiz(submission)
        .map_err(|e: crate::domain::errors::DomainError| e.to_string())
}

#[tauri::command]
pub fn reset_progress(state: State<'_, AppState>) -> Result<(), String> {
    state
        .learning_service
        .reset_progress()
        .map_err(|e: crate::domain::errors::DomainError| e.to_string())
}

// ============ TTS Commands (Volcengine + macOS fallback) ============

static TTS_CONFIG: OnceLock<Mutex<TtsConfig>> = OnceLock::new();
static SAY_CHILD: Mutex<Option<std::process::Child>> = Mutex::new(None);
static AFPLAY_PID: Mutex<Option<u32>> = Mutex::new(None);

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct PersistedTtsConfig {
    appid: String,
    token: String,
    voice: String,
}

#[derive(Debug, Clone)]
struct TtsConfig {
    appid: String,
    token: String,
    voice: String,
    enabled: bool,
}

fn tts_config_path() -> std::path::PathBuf {
    let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
    std::path::PathBuf::from(home)
        .join(".musicday1")
        .join("tts_config.json")
}

fn load_persisted_tts() -> Option<PersistedTtsConfig> {
    let path = tts_config_path();
    let content = std::fs::read_to_string(&path).ok()?;
    serde_json::from_str::<PersistedTtsConfig>(&content).ok()
}

fn save_persisted_tts(config: &PersistedTtsConfig) {
    let path = tts_config_path();
    if let Some(parent) = path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }
    if let Ok(json) = serde_json::to_string_pretty(config) {
        let _ = std::fs::write(&path, json);
    }
}

fn get_tts_config() -> std::sync::MutexGuard<'static, TtsConfig> {
    let config = TTS_CONFIG.get_or_init(|| {
        // Priority: env vars > config file > defaults
        let env_appid = std::env::var("VOLCANO_APPID").unwrap_or_default();
        let env_token = std::env::var("VOLCANO_ACCESS_TOKEN").unwrap_or_default();
        let env_voice = std::env::var("VOLCANO_VOICE").ok();

        let persisted = load_persisted_tts();

        let appid = if !env_appid.is_empty() {
            env_appid
        } else {
            persisted.as_ref().map(|p| p.appid.clone()).unwrap_or_default()
        };
        let token = if !env_token.is_empty() {
            env_token
        } else {
            persisted.as_ref().map(|p| p.token.clone()).unwrap_or_default()
        };
        let voice = env_voice.unwrap_or_else(|| {
            persisted
                .as_ref()
                .map(|p| p.voice.clone())
                .unwrap_or_else(|| "zh_female_vv_mars_bigtts".to_string())
        });
        let enabled = !appid.is_empty() && !token.is_empty();

        Mutex::new(TtsConfig {
            appid,
            token,
            voice,
            enabled,
        })
    });
    config.lock().unwrap()
}

#[tauri::command]
pub fn get_tts_status() -> Result<TtsStatusDto, String> {
    let config = get_tts_config();
    Ok(TtsStatusDto {
        enabled: config.enabled,
        current_voice: config.voice.clone(),
        voices: VOLCANO_VOICES
            .iter()
            .map(|(id, name)| VoiceOptionDto {
                id: id.to_string(),
                name: name.to_string(),
            })
            .collect(),
    })
}

#[tauri::command]
pub fn update_tts_config(voice: Option<String>, appid: Option<String>, token: Option<String>) -> Result<TtsStatusDto, String> {
    let mut config = get_tts_config();
    if let Some(v) = voice {
        config.voice = v;
    }
    if let Some(a) = appid {
        config.appid = a;
    }
    if let Some(t) = token {
        config.token = t;
    }
    config.enabled = !config.appid.is_empty() && !config.token.is_empty();

    // Persist to disk (creds set via UI are saved, env vars remain source of truth on restart)
    save_persisted_tts(&PersistedTtsConfig {
        appid: config.appid.clone(),
        token: config.token.clone(),
        voice: config.voice.clone(),
    });

    Ok(TtsStatusDto {
        enabled: config.enabled,
        current_voice: config.voice.clone(),
        voices: VOLCANO_VOICES
            .iter()
            .map(|(id, name)| VoiceOptionDto {
                id: id.to_string(),
                name: name.to_string(),
            })
            .collect(),
    })
}

#[tauri::command]
pub async fn speak_text(text: String) -> Result<(), String> {
    // Stop any ongoing speech first
    stop_speech_internal();

    let config = {
        let cfg = get_tts_config();
        cfg.clone()
    };

    if config.enabled {
        let tts = VolcanoTts::new(config.appid, config.token, Some(config.voice), None);
        match tts.synthesize_to_file(&text).await {
            Ok(audio_path) => {
                let path = audio_path.to_string_lossy().to_string();
                play_audio_async(path).await;
                return Ok(());
            }
            Err(e) => {
                eprintln!("Volcengine TTS failed: {e}, falling back to macOS say");
            }
        }
    }

    // Fallback to macOS say
    let child = Command::new("say")
        .arg("-v")
        .arg("Mei-Jia")
        .arg(&text)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| format!("Failed to start say: {}", e))?;

    if let Ok(mut guard) = SAY_CHILD.lock() {
        *guard = Some(child);
    }
    Ok(())
}

#[tauri::command]
pub fn stop_speech() -> Result<(), String> {
    stop_speech_internal();
    Ok(())
}

fn stop_speech_internal() {
    if let Ok(mut guard) = SAY_CHILD.lock() {
        if let Some(mut child) = guard.take() {
            let _ = child.kill();
            let _ = child.wait();
        }
    }
    if let Ok(mut guard) = AFPLAY_PID.lock() {
        if let Some(pid) = guard.take() {
            let _ = Command::new("kill").arg(pid.to_string()).status();
        }
    }
}

/// Kill all running audio children. Called on app exit.
pub fn kill_all_audio() {
    stop_speech_internal();
}

async fn play_audio_async(path: String) {
    let path_clone = path.clone();
    let mut child = match Command::new("afplay")
        .arg(&path_clone)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
    {
        Ok(c) => c,
        Err(e) => {
            eprintln!("afplay failed: {}", e);
            let temp_dir = std::env::temp_dir();
            if path.starts_with(temp_dir.to_string_lossy().as_ref()) {
                let _ = std::fs::remove_file(&path);
            }
            return;
        }
    };

    // Store PID so stop_speech can kill it
    if let Ok(mut guard) = AFPLAY_PID.lock() {
        *guard = Some(child.id());
    }

    // Wait for natural completion — do NOT hold the lock
    let _ = child.wait();

    // Clear after completion
    if let Ok(mut guard) = AFPLAY_PID.lock() {
        *guard = None;
    }

    // Clean up temp TTS file
    let temp_dir = std::env::temp_dir();
    if path.starts_with(temp_dir.to_string_lossy().as_ref()) {
        let _ = std::fs::remove_file(&path);
    }
}

// ============ Image Gen Commands ============

static IMAGE_CONFIG: OnceLock<Mutex<ImageConfig>> = OnceLock::new();

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct PersistedImageConfig {
    backend: String,
    api_key: String,
}

#[derive(Debug, Clone)]
struct ImageConfig {
    backend: String,
    api_key: String,
    enabled: bool,
}

const IMAGE_BACKENDS: &[(&str, &str)] = &[
    ("seedream", "Seedream (火山引擎)"),
    ("openai", "OpenAI (DALL-E / GPT-Image)"),
];

fn image_config_path() -> std::path::PathBuf {
    let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
    std::path::PathBuf::from(home)
        .join(".musicday1")
        .join("image_config.json")
}

fn load_persisted_image_config() -> Option<PersistedImageConfig> {
    let path = image_config_path();
    let content = std::fs::read_to_string(&path).ok()?;
    serde_json::from_str::<PersistedImageConfig>(&content).ok()
}

fn save_persisted_image_config(config: &PersistedImageConfig) {
    let path = image_config_path();
    if let Some(parent) = path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }
    if let Ok(json) = serde_json::to_string_pretty(config) {
        let _ = std::fs::write(&path, json);
    }
}

fn get_image_config() -> std::sync::MutexGuard<'static, ImageConfig> {
    let config = IMAGE_CONFIG.get_or_init(|| {
        let env_key = std::env::var("SEEDREAM_API_KEY")
            .or_else(|_| std::env::var("OPENAI_API_KEY"))
            .unwrap_or_default();
        let env_backend = if std::env::var("SEEDREAM_API_KEY").is_ok() {
            "seedream"
        } else if std::env::var("OPENAI_API_KEY").is_ok() {
            "openai"
        } else {
            ""
        };

        let persisted = load_persisted_image_config();

        let backend = if !env_backend.is_empty() {
            env_backend.to_string()
        } else {
            persisted
                .as_ref()
                .map(|p| p.backend.clone())
                .unwrap_or_else(|| "seedream".to_string())
        };

        let api_key = if !env_key.is_empty() {
            env_key
        } else {
            persisted
                .as_ref()
                .map(|p| p.api_key.clone())
                .unwrap_or_default()
        };

        let enabled = !api_key.is_empty();

        Mutex::new(ImageConfig {
            backend,
            api_key,
            enabled,
        })
    });
    config.lock().unwrap()
}

#[tauri::command]
pub fn get_image_gen_status() -> Result<ImageGenStatusDto, String> {
    let config = get_image_config();
    Ok(ImageGenStatusDto {
        enabled: config.enabled,
        backend: config.backend.clone(),
        backends: IMAGE_BACKENDS
            .iter()
            .map(|(id, name)| ImageBackendOptionDto {
                id: id.to_string(),
                name: name.to_string(),
            })
            .collect(),
    })
}

#[tauri::command]
pub fn update_image_gen_config(
    backend: Option<String>,
    api_key: Option<String>,
) -> Result<ImageGenStatusDto, String> {
    let mut config = get_image_config();
    if let Some(b) = backend {
        config.backend = b;
    }
    if let Some(k) = api_key {
        config.api_key = k;
    }
    config.enabled = !config.api_key.is_empty();

    save_persisted_image_config(&PersistedImageConfig {
        backend: config.backend.clone(),
        api_key: config.api_key.clone(),
    });

    Ok(ImageGenStatusDto {
        enabled: config.enabled,
        backend: config.backend.clone(),
        backends: IMAGE_BACKENDS
            .iter()
            .map(|(id, name)| ImageBackendOptionDto {
                id: id.to_string(),
                name: name.to_string(),
            })
            .collect(),
    })
}

#[tauri::command]
pub async fn generate_image(
    prompt: String,
    aspect_ratio: Option<String>,
) -> Result<ImageGenResultDto, String> {
    let config = {
        let cfg = get_image_config();
        cfg.clone()
    };

    if !config.enabled {
        return Err("Image generation is not configured. Add an API key in Settings.".to_string());
    }

    let options = image::ImageGenOptions {
        prompt,
        aspect_ratio,
    };

    let result = match config.backend.as_str() {
        "seedream" => image::generate_seedream(&config.api_key, &options).await?,
        "openai" => image::generate_openai(&config.api_key, &options).await?,
        other => return Err(format!("Unknown image backend: {}", other)),
    };

    Ok(ImageGenResultDto {
        base64: result.base64,
        width: result.width,
        height: result.height,
    })
}
