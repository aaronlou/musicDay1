import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Key,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Bot,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Volume2,
  Languages,
} from "lucide-react";
import type { AISettings, LLMProvider } from "@/types/ai";
import { DEFAULT_MODELS, PROVIDER_BASE_URLS } from "@/types/ai";
import { useImageGen } from "@/hooks/useImageGen";
import { getTtsStatus, updateTtsConfig } from "@/api";
import type { TtsStatusDto } from "@/api/types";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { getVersion } from "@tauri-apps/api/app";
import {
  RefreshCw,
  Download,
  RotateCcw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage, type AppLanguage } from "@/context/LanguageContext";

const AI_SETTINGS_KEY = "musicday1-ai-settings";

function loadAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    provider: "deepseek",
    apiKey: "",
    model: DEFAULT_MODELS.deepseek[0],
    enabled: false,
  };
}

export default function Settings() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const [aiSettings, setAISettings] = useState<AISettings>(loadAISettings);
  const [showAIKey, setShowAIKey] = useState(false);
  const [showImgKey, setShowImgKey] = useState(false);
  const [showTtsKey, setShowTtsKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testMsg, setTestMsg] = useState("");

  // TTS state
  const [ttsStatus, setTtsStatus] = useState<TtsStatusDto | null>(null);
  const [ttsAppId, setTtsAppId] = useState("");
  const [ttsToken, setTtsToken] = useState("");
  const [ttsVoice, setTtsVoice] = useState("");

  // Updater state
  const [appVersion, setAppVersion] = useState("...");
  const [updateState, setUpdateState] = useState<"idle" | "checking" | "available" | "downloading" | "ready" | "error">("idle");
  const [updateMsg, setUpdateMsg] = useState("");

  useEffect(() => {
    getVersion().then(setAppVersion);
  }, []);

  const checkForUpdates = async () => {
    setUpdateState("checking");
    setUpdateMsg("");
    try {
      const update = await check();
      if (update) {
        setUpdateState("downloading");
        let downloaded = 0;
        await update.downloadAndInstall((e) => {
          switch (e.event) {
            case "Finished":
              setUpdateState("ready");
              setUpdateMsg(t("settings.updateDownloaded", { version: update.version }));
              downloaded = 1;
              break;
            case "Progress":
              downloaded += e.data.chunkLength;
              setUpdateMsg(t("settings.downloading") + ` ${(downloaded / 1024).toFixed(0)}KB`);
              break;
            case "Started":
              setUpdateMsg(t("settings.startingDownload"));
              break;
          }
        });
        if (!downloaded) {
          setUpdateState("ready");
          setUpdateMsg(t("settings.updateReady", { version: update.version }));
        }
      } else {
        setUpdateState("idle");
        setUpdateMsg(t("settings.upToDate"));
      }
    } catch (err: any) {
      setUpdateState("error");
      setUpdateMsg(t("settings.updateCheckFailed", { error: err.message ?? err }));
    }
  };

  const restartForUpdate = async () => {
    await relaunch();
  };

  useEffect(() => {
    localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(aiSettings));
  }, [aiSettings]);

  const {
    status: imageStatus,
    setBackend: setImageBackend,
    setApiKey: setImageApiKey,
  } = useImageGen();

  useEffect(() => {
    getTtsStatus().then((status) => {
      setTtsStatus(status);
      setTtsVoice(status.current_voice);
    });
  }, []);

  const updateTts = async (changes: { voice?: string; appid?: string; token?: string }) => {
    const status = await updateTtsConfig({
      ...changes,
      appid: changes.appid !== undefined ? changes.appid : ttsAppId || undefined,
      token: changes.token !== undefined ? changes.token : ttsToken || undefined,
    });
    setTtsStatus(status);
    setTtsVoice(status.current_voice);
  };

  const handleProviderChange = (p: LLMProvider) => {
    setAISettings((prev) => ({
      ...prev,
      provider: p,
      model: DEFAULT_MODELS[p][0],
    }));
  };

  const testConnection = async () => {
    if (!aiSettings.apiKey) return;
    setTestStatus("testing");
    setTestMsg("");

    try {
      if (aiSettings.provider === "anthropic") {
        const res = await fetch(`${PROVIDER_BASE_URLS.anthropic}/models`, {
          headers: {
            "x-api-key": aiSettings.apiKey,
            "anthropic-version": "2023-06-01",
          },
        });
        if (res.ok) {
          setTestStatus("success");
          setTestMsg(t("settings.connectionSuccess"));
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } else {
        const res = await fetch(`${PROVIDER_BASE_URLS[aiSettings.provider]}/models`, {
          headers: { Authorization: `Bearer ${aiSettings.apiKey}` },
        });
        if (res.ok) {
          setTestStatus("success");
          setTestMsg(t("settings.connectionSuccess"));
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      }
    } catch (err: any) {
      setTestStatus("error");
      setTestMsg(t("settings.connectionFailed", { error: err.message }));
    }
  };

  const clearAllData = () => {
    if (confirm(t("settings.clearConfirm"))) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">{t("settings.title")}</h1>
        <p className="text-text-muted">{t("settings.subtitle")}</p>
      </motion.div>

      {/* Language Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-surface rounded-2xl p-6 border border-surface-light mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Languages className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t("settings.language")}</h2>
            <p className="text-text-muted text-sm">{t("settings.languageDesc")}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(["auto", "zh", "en"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang === "auto" ? (navigator.language.startsWith("zh") ? "zh" : "en") : lang as AppLanguage)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                (lang === "auto"
                  ? language === (navigator.language.startsWith("zh") ? "zh" : "en")
                  : language === lang)
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-surface-light bg-surface-light/50 text-text-muted hover:border-primary/50"
              }`}
            >
              {lang === "auto" ? t("settings.languageAuto") : lang === "zh" ? t("settings.languageZh") : t("settings.languageEn")}
            </button>
          ))}
        </div>
      </motion.div>

      {/* AI Chat Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-2xl p-6 border border-surface-light mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t("settings.aiTutor")}</h2>
            <p className="text-text-muted text-sm">{t("settings.aiTutorDesc")}</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-surface-light">
          <span className="text-sm">{t("settings.enableAi")}</span>
          <button
            onClick={() => setAISettings((p) => ({ ...p, enabled: !p.enabled }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              aiSettings.enabled ? "bg-primary" : "bg-surface-light"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                aiSettings.enabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {aiSettings.enabled && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-text-muted mb-1.5 block">{t("settings.provider")}</label>
              <div className="grid grid-cols-4 gap-2">
                {(["openai", "anthropic", "deepseek", "openrouter"] as LLMProvider[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleProviderChange(p)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                      aiSettings.provider === p
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-surface-light bg-surface-light/50 text-text-muted hover:border-primary/50"
                    }`}
                  >
                    {p === "openai" ? "OpenAI" : p === "anthropic" ? "Claude" : p === "deepseek" ? "DeepSeek" : "OpenRouter"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-text-muted mb-1.5 block">{t("settings.model")}</label>
              <select
                value={aiSettings.model}
                onChange={(e) => setAISettings((p) => ({ ...p, model: e.target.value }))}
                className="w-full bg-surface-light rounded-lg px-3 py-2.5 text-sm outline-none border border-transparent focus:border-primary text-text"
              >
                {DEFAULT_MODELS[aiSettings.provider].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-text-muted mb-1.5 block">{t("settings.apiKey")}</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type={showAIKey ? "text" : "password"}
                    value={aiSettings.apiKey}
                    onChange={(e) => setAISettings((p) => ({ ...p, apiKey: e.target.value }))}
                    placeholder={`sk-...`}
                    className="w-full bg-surface-light rounded-lg pl-9 pr-9 py-2.5 text-sm outline-none border border-transparent focus:border-primary text-text placeholder:text-text-muted"
                  />
                  <button
                    onClick={() => setShowAIKey((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    {showAIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={testConnection}
                  disabled={!aiSettings.apiKey || testStatus === "testing"}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                  {testStatus === "testing" ? t("settings.testing") : t("settings.testConnection")}
                </button>
              </div>
              {testStatus === "success" && (
                <div className="flex items-center gap-1 text-success text-xs mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {testMsg}
                </div>
              )}
              {testStatus === "error" && (
                <div className="flex items-center gap-1 text-danger text-xs mt-2">
                  <AlertCircle className="w-3.5 h-3.5" /> {testMsg}
                </div>
              )}
              <p className="text-xs text-text-muted mt-2">
                {t("settings.apiKeyHint")}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* TTS Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13 }}
        className="bg-surface rounded-2xl p-6 border border-surface-light mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t("settings.tts")}</h2>
            <p className="text-text-muted text-sm">{t("settings.ttsDesc")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface-light/50 rounded-xl p-3 border border-surface-light">
            <p className="text-xs text-text-muted mb-2">
              {t("settings.ttsHint1")}
            </p>
            <p className="text-xs text-text-muted">
              {t("settings.ttsHint2")}
            </p>
          </div>

          <div>
            <label className="text-sm text-text-muted mb-1.5 block">{t("settings.appId")}</label>
            <input
              type="text"
              value={ttsAppId}
              onChange={(e) => setTtsAppId(e.target.value)}
              onBlur={() => ttsAppId && updateTts({ appid: ttsAppId })}
              placeholder={t("settings.appId")}
              className="w-full bg-surface-light rounded-lg px-3 py-2.5 text-sm outline-none border border-transparent focus:border-primary text-text placeholder:text-text-muted"
            />
          </div>

          <div>
            <label className="text-sm text-text-muted mb-1.5 block">{t("settings.accessToken")}</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type={showTtsKey ? "text" : "password"}
                value={ttsToken}
                onChange={(e) => setTtsToken(e.target.value)}
                onBlur={() => ttsToken && updateTts({ token: ttsToken })}
                placeholder={t("settings.accessToken")}
                className="w-full bg-surface-light rounded-lg pl-9 pr-9 py-2.5 text-sm outline-none border border-transparent focus:border-primary text-text placeholder:text-text-muted"
              />
              <button
                onClick={() => setShowTtsKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
              >
                {showTtsKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-text-muted mb-1.5 block">{t("settings.voice")}</label>
            <select
              value={ttsVoice}
              onChange={(e) => {
                setTtsVoice(e.target.value);
                updateTts({ voice: e.target.value });
              }}
              className="w-full bg-surface-light rounded-lg px-3 py-2.5 text-sm outline-none border border-transparent focus:border-primary text-text"
            >
              {(ttsStatus?.voices ?? []).map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {ttsStatus?.enabled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span className="text-success">
                  {t("settings.ttsReady", { voice: ttsStatus.current_voice })}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-warning" />
                <span className="text-warning">
                  {t("settings.ttsFallback")}
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Image Gen Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-surface rounded-2xl p-6 border border-surface-light mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t("settings.imageGen")}</h2>
            <p className="text-text-muted text-sm">{t("settings.imageGenDesc")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-muted mb-1.5 block">{t("settings.imageBackend")}</label>
            <div className="grid grid-cols-2 gap-2">
              {(imageStatus?.backends ?? []).map((b) => (
                <button
                  key={b.id}
                  onClick={() => setImageBackend(b.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    imageStatus?.backend === b.id
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-surface-light bg-surface-light/50 text-text-muted hover:border-primary/50"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-text-muted mb-1.5 block">
              {t("settings.apiKey")}
              {imageStatus?.backend === "seedream" && (
                <span className="text-text-muted/60"> — {t("settings.arkApiKey")}</span>
              )}
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type={showImgKey ? "text" : "password"}
                onChange={(e) => setImageApiKey(e.target.value)}
                onBlur={(e) => e.target.value && setImageApiKey(e.target.value)}
                placeholder={
                  imageStatus?.backend === "seedream"
                    ? "ark-..."
                    : "sk-..."
                }
                className="w-full bg-surface-light rounded-lg pl-9 pr-9 py-2.5 text-sm outline-none border border-transparent focus:border-primary text-text placeholder:text-text-muted"
              />
              <button
                onClick={() => setShowImgKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
              >
                {showImgKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {imageStatus?.backend === "seedream" && (
              <p className="text-xs text-text-muted mt-1.5">
                {t("settings.createApiKey")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            {imageStatus?.enabled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span className="text-success">
                  {t("settings.imageReady", { backend: imageStatus.backend })}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-warning" />
                <span className="text-warning">{t("settings.imageNotConfigured")}</span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Version & Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="bg-surface rounded-2xl p-6 border border-surface-light mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-success" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t("settings.versionUpdates")}</h2>
            <p className="text-text-muted text-sm">{t("settings.currentVersion", { version: appVersion })}</p>
          </div>
        </div>

        <div className="space-y-3">
          {updateState === "ready" ? (
            <button
              onClick={restartForUpdate}
              className="flex items-center gap-2 bg-success hover:bg-success/80 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              {t("settings.restartInstall")}
            </button>
          ) : (
            <button
              onClick={checkForUpdates}
              disabled={updateState === "checking" || updateState === "downloading"}
              className="flex items-center gap-2 bg-surface-light hover:bg-primary/10 hover:text-primary text-text-muted px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full justify-center disabled:opacity-50"
            >
              {updateState === "checking" ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : updateState === "downloading" ? (
                <Download className="w-4 h-4" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {updateState === "checking"
                ? t("settings.checking")
                : updateState === "downloading"
                ? updateMsg || t("settings.downloading")
                : t("settings.checkUpdates")}
            </button>
          )}

          {updateState === "idle" && updateMsg && (
            <div className="flex items-center gap-2 text-xs text-success">
              <CheckCircle2 className="w-3.5 h-3.5" /> {updateMsg}
            </div>
          )}
          {updateState === "error" && (
            <div className="flex items-center gap-2 text-xs text-danger">
              <AlertCircle className="w-3.5 h-3.5" /> {updateMsg}
            </div>
          )}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-2xl p-6 border border-surface-light"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-danger/20 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-danger" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t("settings.dataManagement")}</h2>
            <p className="text-text-muted text-sm">{t("settings.dataManagementDesc")}</p>
          </div>
        </div>
        <button
          onClick={clearAllData}
          className="flex items-center gap-2 text-danger hover:text-danger/80 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {t("settings.clearAllData")}
        </button>
      </motion.div>
    </div>
  );
}
