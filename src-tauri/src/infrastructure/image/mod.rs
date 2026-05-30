mod openai;
mod seedream;

pub use openai::generate as generate_openai;
pub use seedream::generate as generate_seedream;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageGenOptions {
    pub prompt: String,
    pub aspect_ratio: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageGenResult {
    pub base64: Option<String>,
    pub url: Option<String>,
    pub width: u32,
    pub height: u32,
}

fn size_from_aspect(aspect_ratio: Option<&str>) -> &str {
    match aspect_ratio.unwrap_or("1:1") {
        "16:9" => "2560x1440",
        "4:3" => "2304x1728",
        "9:16" => "1440x2560",
        _ => "2K", // 1:1
    }
}
