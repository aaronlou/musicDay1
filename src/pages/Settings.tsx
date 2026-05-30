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
} from "lucide-react";
import type { AISettings, LLMProvider } from "@/types/ai";
import { DEFAULT_MODELS, PROVIDER_BASE_URLS } from "@/types/ai";
import type { ImageGenSettings } from "@/hooks/useImageGen";
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

const AI_SETTINGS_KEY = "musicday1-ai-settings";
const IMAGE_SETTINGS_KEY = "musicday1-image-settings";

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

function loadImageSettings(): ImageGenSettings {
  try {
    const raw = localStorage.getItem(IMAGE_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    enabled: false,
    provider: "openai",
    apiKey: "",
    model: "gpt-image-1",
  };
}

export default function Settings() {
  const [aiSettings, setAISettings] = useState<AISettings>(loadAISettings);
  const [imgSettings, setImgSettings] = useState<ImageGenSettings>(loadImageSettings);
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
              setUpdateMsg(`v${update.version} 已下载，点击重启安装`);
              downloaded = 1;
              break;
            case "Progress":
              downloaded += e.data.chunkLength;
              setUpdateMsg(`下载中... ${(downloaded / 1024).toFixed(0)}KB`);
              break;
            case "Started":
              setUpdateMsg("开始下载...");
              break;
          }
        });
        if (!downloaded) {
          setUpdateState("ready");
          setUpdateMsg(`v${update.version} 已就绪`);
        }
      } else {
        setUpdateState("idle");
        setUpdateMsg("已是最新版本");
      }
    } catch (err: any) {
      setUpdateState("error");
      setUpdateMsg(`检查更新失败: ${err.message ?? err}`);
    }
  };

  const restartForUpdate = async () => {
    await relaunch();
  };

  useEffect(() => {
    localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(aiSettings));
  }, [aiSettings]);

  useEffect(() => {
    localStorage.setItem(IMAGE_SETTINGS_KEY, JSON.stringify(imgSettings));
  }, [imgSettings]);

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
          setTestMsg("连接成功！API Key 有效。");
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } else {
        const res = await fetch(`${PROVIDER_BASE_URLS[aiSettings.provider]}/models`, {
          headers: { Authorization: `Bearer ${aiSettings.apiKey}` },
        });
        if (res.ok) {
          setTestStatus("success");
          setTestMsg("连接成功！API Key 有效。");
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      }
    } catch (err: any) {
      setTestStatus("error");
      setTestMsg(`连接失败：${err.message}`);
    }
  };

  const clearAllData = () => {
    if (confirm("确定要清除所有本地数据（包括学习进度、AI 设置和图片缓存）吗？此操作不可撤销。")) {
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
        <h1 className="text-3xl font-bold mb-2">设置</h1>
        <p className="text-text-muted">配置 AI 导师、图片生成和其他应用设置</p>
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
            <h2 className="text-lg font-bold">AI 乐理导师</h2>
            <p className="text-text-muted text-sm">配置 LLM API，开启 AI 互动学习</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-surface-light">
          <span className="text-sm">启用 AI 导师</span>
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
              <label className="text-sm text-text-muted mb-1.5 block">服务商</label>
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
              <label className="text-sm text-text-muted mb-1.5 block">模型</label>
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
              <label className="text-sm text-text-muted mb-1.5 block">API Key</label>
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
                  {testStatus === "testing" ? "测试中..." : "测试连接"}
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
                API Key 仅存储在你的本地设备上。推荐使用 DeepSeek，性价比高且中文支持好。
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
            <h2 className="text-lg font-bold">语音朗读 (TTS)</h2>
            <p className="text-text-muted text-sm">
              配置火山引擎 TTS，获得高质量中文朗读音色
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface-light/50 rounded-xl p-3 border border-surface-light">
            <p className="text-xs text-text-muted mb-2">
              需要火山引擎大模型语音合成服务。前往 <a href="https://console.volcengine.com/tts" target="_blank" rel="noopener noreferrer" className="text-primary underline">console.volcengine.com/tts</a> 开通后获取凭证。
            </p>
            <p className="text-xs text-text-muted">
              也可以设置环境变量 <code className="text-primary bg-primary/10 px-1 rounded">VOLCANO_APPID</code> 和{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">VOLCANO_ACCESS_TOKEN</code>。
            </p>
          </div>

          <div>
            <label className="text-sm text-text-muted mb-1.5 block">App ID</label>
            <input
              type="text"
              value={ttsAppId}
              onChange={(e) => setTtsAppId(e.target.value)}
              onBlur={() => ttsAppId && updateTts({ appid: ttsAppId })}
              placeholder="火山引擎 App ID"
              className="w-full bg-surface-light rounded-lg px-3 py-2.5 text-sm outline-none border border-transparent focus:border-primary text-text placeholder:text-text-muted"
            />
          </div>

          <div>
            <label className="text-sm text-text-muted mb-1.5 block">Access Token</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type={showTtsKey ? "text" : "password"}
                value={ttsToken}
                onChange={(e) => setTtsToken(e.target.value)}
                onBlur={() => ttsToken && updateTts({ token: ttsToken })}
                placeholder="火山引擎 Access Token"
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
            <label className="text-sm text-text-muted mb-1.5 block">朗读音色</label>
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
                  火山引擎 TTS 已就绪 — 当前音色: {ttsStatus.current_voice}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-warning" />
                <span className="text-warning">
                  未配置凭证，使用 macOS 系统语音 (Mei-Jia)
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
            <h2 className="text-lg font-bold">AI 图片生成</h2>
            <p className="text-text-muted text-sm">为课程内容生成 AI 配图</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-surface-light">
          <span className="text-sm">启用 AI 配图</span>
          <button
            onClick={() => setImgSettings((p) => ({ ...p, enabled: !p.enabled }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              imgSettings.enabled ? "bg-primary" : "bg-surface-light"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                imgSettings.enabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {imgSettings.enabled && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-text-muted mb-1.5 block">服务商</label>
              <div className="grid grid-cols-2 gap-2">
                {(["openai", "openrouter"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setImgSettings((prev) => ({ ...prev, provider: p, model: p === "openai" ? "gpt-image-1" : "openai/gpt-image-1" }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                      imgSettings.provider === p
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-surface-light bg-surface-light/50 text-text-muted hover:border-primary/50"
                    }`}
                  >
                    {p === "openai" ? "OpenAI (DALL-E / GPT-Image)" : "OpenRouter"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-text-muted mb-1.5 block">模型</label>
              <input
                type="text"
                value={imgSettings.model}
                onChange={(e) => setImgSettings((p) => ({ ...p, model: e.target.value }))}
                placeholder="gpt-image-1"
                className="w-full bg-surface-light rounded-lg px-3 py-2.5 text-sm outline-none border border-transparent focus:border-primary text-text placeholder:text-text-muted"
              />
            </div>

            <div>
              <label className="text-sm text-text-muted mb-1.5 block">API Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showImgKey ? "text" : "password"}
                  value={imgSettings.apiKey}
                  onChange={(e) => setImgSettings((p) => ({ ...p, apiKey: e.target.value }))}
                  placeholder="sk-..."
                  className="w-full bg-surface-light rounded-lg pl-9 pr-9 py-2.5 text-sm outline-none border border-transparent focus:border-primary text-text placeholder:text-text-muted"
                />
                <button
                  onClick={() => setShowImgKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showImgKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
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
            <h2 className="text-lg font-bold">版本更新</h2>
            <p className="text-text-muted text-sm">当前版本 v{appVersion}</p>
          </div>
        </div>

        <div className="space-y-3">
          {updateState === "ready" ? (
            <button
              onClick={restartForUpdate}
              className="flex items-center gap-2 bg-success hover:bg-success/80 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              重启安装更新
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
                ? "检查中..."
                : updateState === "downloading"
                ? updateMsg || "下载中..."
                : "检查更新"}
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
            <h2 className="text-lg font-bold">数据管理</h2>
            <p className="text-text-muted text-sm">清除本地存储的所有数据</p>
          </div>
        </div>
        <button
          onClick={clearAllData}
          className="flex items-center gap-2 text-danger hover:text-danger/80 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          清除所有本地数据
        </button>
      </motion.div>
    </div>
  );
}
