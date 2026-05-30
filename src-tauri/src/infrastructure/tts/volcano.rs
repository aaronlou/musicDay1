use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use serde::Deserialize;
use std::path::PathBuf;

const VOLCANO_URL: &str = "https://openspeech.bytedance.com/api/v3/tts/unidirectional";
const DEFAULT_RESOURCE_ID: &str = "seed-tts-1.0";

/// Available Volcengine TTS voices (seed-tts-1.0).
pub const VOLCANO_VOICES: &[(&str, &str)] = &[
    ("zh_female_vv_mars_bigtts", "Vivi - 活泼灵动 (推荐)"),
    ("zh_female_qinqienvsheng_moon_bigtts", "亲切女声"),
    ("zh_female_wenrouxiaoya_moon_bigtts", "温柔小雅"),
    ("zh_female_vv_uranus_bigtts", "Vivi 2.0 (seed-tts-2.0)"),
    ("zh_male_yunzhou_uranus_bigtts", "云舟 - 男声 (seed-tts-2.0)"),
];

#[derive(Debug, Deserialize)]
struct TtsChunk {
    code: Option<i64>,
    message: Option<String>,
    data: Option<String>,
}

pub struct VolcanoTts {
    appid: String,
    token: String,
    voice: String,
    resource_id: String,
    client: reqwest::Client,
}

impl VolcanoTts {
    pub fn new(appid: String, token: String, voice: Option<String>, resource_id: Option<String>) -> Self {
        Self {
            appid,
            token,
            voice: voice.unwrap_or_else(|| "zh_female_vv_mars_bigtts".to_string()),
            resource_id: resource_id.unwrap_or_else(|| DEFAULT_RESOURCE_ID.to_string()),
            client: reqwest::Client::new(),
        }
    }

    pub fn voice(&self) -> &str {
        &self.voice
    }

    /// Synthesize text to an audio file (MP3). Returns the file path on success.
    pub async fn synthesize_to_file(&self, text: &str) -> Result<PathBuf, String> {
        let audio_bytes = self.synthesize(text).await?;

        let mut path = std::env::temp_dir();
        path.push(format!("musicday1_tts_{}.mp3", uuid_like()));
        std::fs::write(&path, &audio_bytes)
            .map_err(|e| format!("Failed to write TTS audio: {e}"))?;

        Ok(path)
    }

    /// Synthesize text to raw audio bytes.
    pub async fn synthesize(&self, text: &str) -> Result<Vec<u8>, String> {
        let payload = serde_json::json!({
            "req_params": {
                "text": text,
                "speaker": self.voice,
                "audio_params": {
                    "format": "mp3",
                    "sample_rate": 24000,
                },
            },
        });

        let response: reqwest::Response = self
            .client
            .post(VOLCANO_URL)
            .header("X-Api-App-Key", &self.appid)
            .header("X-Api-Access-Key", format!("Bearer;{}", self.token))
            .header("X-Api-Resource-Id", &self.resource_id)
            .header("Content-Type", "application/json")
            .json(&payload)
            .send()
            .await
            .map_err(|e| format!("Volcengine TTS request failed: {e}"))?;

        if !response.status().is_success() {
            let status_code = response.status().as_u16();
            let error_body: String = response.text().await.unwrap_or_default();
            return Err(format!(
                "Volcengine TTS HTTP {}: {}",
                status_code, error_body
            ));
        }

        let body: String = response
            .text()
            .await
            .map_err(|e| format!("Failed to read response body: {e}"))?;

        let mut audio_bytes: Vec<u8> = Vec::new();

        for raw_line in body.lines() {
            let line: &str = raw_line.trim();
            if line.is_empty() {
                continue;
            }
            let chunk: TtsChunk = serde_json::from_str(line)
                .map_err(|e| format!("Failed to parse TTS chunk: {e}"))?;

            match chunk.code {
                Some(20000000) => break, // end marker
                Some(code) if code != 0 => {
                    return Err(format!(
                        "Volcengine TTS error {}: {}",
                        code,
                        chunk.message.unwrap_or_else(|| "unknown".to_string())
                    ));
                }
                _ => {}
            }

            if let Some(data) = chunk.data {
                let decoded = BASE64
                    .decode(&data)
                    .map_err(|e| format!("Failed to decode base64 audio: {e}"))?;
                audio_bytes.extend_from_slice(&decoded);
            }
        }

        if audio_bytes.is_empty() {
            return Err("Volcengine TTS response has no audio data".to_string());
        }

        Ok(audio_bytes)
    }
}

fn uuid_like() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let ts = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();
    format!("{:x}", ts)
}
