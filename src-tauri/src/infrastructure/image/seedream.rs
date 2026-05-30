use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use serde::Deserialize;

use super::{size_from_aspect, ImageGenOptions, ImageGenResult};

const DEFAULT_MODEL: &str = "doubao-seedream-4-5-251128";
const BASE_URL: &str = "https://ark.cn-beijing.volces.com/api/v3/images/generations";

#[derive(Debug, Deserialize)]
struct SeedreamResponse {
    data: Option<Vec<SeedreamImage>>,
    error: Option<SeedreamError>,
}

#[derive(Debug, Deserialize)]
struct SeedreamImage {
    url: Option<String>,
    b64_json: Option<String>,
}

#[derive(Debug, Deserialize)]
struct SeedreamError {
    message: String,
}

pub async fn generate(api_key: &str, options: &ImageGenOptions) -> Result<ImageGenResult, String> {
    let size = size_from_aspect(options.aspect_ratio.as_deref());

    let payload = serde_json::json!({
        "model": DEFAULT_MODEL,
        "prompt": options.prompt,
        "size": size,
        "watermark": false,
    });

    let client = reqwest::Client::new();
    let response = client
        .post(BASE_URL)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Seedream request failed: {e}"))?;

    if !response.status().is_success() {
        let status = response.status().as_u16();
        let body = response.text().await.unwrap_or_default();
        return Err(format!("Seedream HTTP {}: {}", status, body));
    }

    let data: SeedreamResponse = response
        .json()
        .await
        .map_err(|e| format!("Seedream parse error: {e}"))?;

    if let Some(err) = data.error {
        return Err(format!("Seedream error: {}", err.message));
    }

    let img = data
        .data
        .and_then(|mut v| v.pop())
        .ok_or("Seedream returned no image")?;

    // Seedream returns URL; we fetch it and convert to base64 for the frontend
    let base64 = if let Some(url) = img.url {
        Some(download_as_base64(&client, &url).await?)
    } else if let Some(b64) = img.b64_json {
        Some(b64)
    } else {
        None
    };

    Ok(ImageGenResult {
        base64,
        url: None,
        width: 1024,
        height: 1024,
    })
}

async fn download_as_base64(client: &reqwest::Client, url: &str) -> Result<String, String> {
    let response = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("Failed to download image: {e}"))?;

    let bytes = response
        .bytes()
        .await
        .map_err(|e| format!("Failed to read image bytes: {e}"))?;

    Ok(BASE64.encode(&bytes))
}
