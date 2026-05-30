use serde::Deserialize;

use super::{ImageGenOptions, ImageGenResult};

const DEFAULT_MODEL: &str = "gpt-image-1";
const BASE_URL: &str = "https://api.openai.com/v1/images/generations";

#[derive(Debug, Deserialize)]
struct OpenaiResponse {
    data: Option<Vec<OpenaiImage>>,
    error: Option<OpenaiError>,
}

#[derive(Debug, Deserialize)]
struct OpenaiImage {
    url: Option<String>,
    b64_json: Option<String>,
}

#[derive(Debug, Deserialize)]
struct OpenaiError {
    message: String,
}

pub async fn generate(api_key: &str, options: &ImageGenOptions) -> Result<ImageGenResult, String> {
    let size = match options.aspect_ratio.as_deref() {
        Some("16:9") => "1792x1024",
        Some("4:3") | None => "1024x1024",
        Some("9:16") => "1024x1792",
        _ => "1024x1024",
    };

    let payload = serde_json::json!({
        "model": DEFAULT_MODEL,
        "prompt": options.prompt,
        "n": 1,
        "size": size,
        "response_format": "b64_json",
    });

    let client = reqwest::Client::new();
    let response = client
        .post(BASE_URL)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("OpenAI request failed: {e}"))?;

    if !response.status().is_success() {
        let status = response.status().as_u16();
        let body = response.text().await.unwrap_or_default();
        return Err(format!("OpenAI HTTP {}: {}", status, body));
    }

    let data: OpenaiResponse = response
        .json()
        .await
        .map_err(|e| format!("OpenAI parse error: {e}"))?;

    if let Some(err) = data.error {
        return Err(format!("OpenAI error: {}", err.message));
    }

    let img = data
        .data
        .and_then(|mut v| v.pop())
        .ok_or("OpenAI returned no image")?;

    Ok(ImageGenResult {
        base64: img.b64_json,
        url: img.url,
        width: 1024,
        height: 1024,
    })
}
