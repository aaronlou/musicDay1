pub mod application;
pub mod domain;
pub mod infrastructure;
pub mod interface;

use tauri::Manager;

use interface::commands::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir()?;
            let state = AppState::new(app_data_dir);
            app.manage(state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            interface::commands::get_course_catalog,
            interface::commands::get_lesson_detail,
            interface::commands::get_quiz,
            interface::commands::get_navigation,
            interface::commands::mark_lesson_complete,
            interface::commands::get_user_progress,
            interface::commands::get_lesson_accessibility,
            interface::commands::submit_quiz,
            interface::commands::reset_progress,
            interface::commands::speak_text,
            interface::commands::stop_speech,
            interface::commands::get_tts_status,
            interface::commands::update_tts_config,
            interface::commands::get_image_gen_status,
            interface::commands::update_image_gen_config,
            interface::commands::generate_image,
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_app_handle, event| {
        if let tauri::RunEvent::Exit = event {
            interface::commands::kill_all_audio();
        }
    });
}
