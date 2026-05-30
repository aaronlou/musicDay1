# MusicDay1 (Music Theory Master)

> 零基础乐理学习 App —— 从零开始，系统掌握音乐理论

## 项目简介

「MusicDay1」是一款面向零基础音乐小白的 macOS 桌面应用，采用 **Tauri + Rust + React + TypeScript** 技术栈构建。通过结构化的课程体系、随堂测验和虚拟钢琴工具，帮助用户从零开始系统学习音乐理论，为后续学习乐器打下坚实基础。

## 核心功能

- 📚 **系统课程**：5大章节、17节精品课程，涵盖音符、节拍、音阶、音程、和弦、调号、五线谱等核心乐理知识
- 📝 **随堂测验**：每节课配套测验，包含单选、多选、判断、填空等多种题型，即时反馈解析
- 🎹 **虚拟钢琴**：内置可交互虚拟钢琴，支持鼠标点击和键盘演奏，附带C大调音阶和常用和弦一键播放
- 📊 **学习进度**：自动追踪学习轨迹、测验成绩、连续学习天数，可视化展示成长路径
- 🔒 **解锁机制**：按顺序解锁课程，循序渐进，避免跳跃式学习

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 6 |
| 样式方案 | Tailwind CSS 4 |
| UI 动画 | Framer Motion |
| 图标库 | Lucide React |
| 桌面框架 | Tauri 2 |
| 后端语言 | Rust |

## 快速开始

### 开发模式

```bash
# 安装依赖
pnpm install

# 启动开发服务器（带热更新）
pnpm tauri:dev
```

### 构建生产版本

```bash
# 构建 macOS App 和 DMG 安装包
pnpm tauri:build
```

构建产物位于：
- App: `src-tauri/target/release/bundle/macos/MusicDay1.app`
- DMG: `src-tauri/target/release/bundle/dmg/MusicDay1_1.0.0_aarch64.dmg`

### 发布 macOS DMG

对外分发的 DMG 必须使用 Developer ID 签名并通过 Apple 公证。构建前需要本机安装 Developer ID Application 证书，并提供 App Store Connect API key：

```bash
export APPLE_API_KEY="YOUR_KEY_ID"
export APPLE_API_ISSUER="YOUR_ISSUER_ID"
export APPLE_API_KEY_PATH="$HOME/.appstoreconnect/private_keys/AuthKey_YOUR_KEY_ID.p8"

pnpm tauri build --bundles app,dmg
xcrun notarytool submit src-tauri/target/release/bundle/dmg/MusicDay1_1.0.0_aarch64.dmg \
  --key "$APPLE_API_KEY_PATH" \
  --key-id "$APPLE_API_KEY" \
  --issuer "$APPLE_API_ISSUER" \
  --wait
xcrun stapler staple src-tauri/target/release/bundle/dmg/MusicDay1_1.0.0_aarch64.dmg
spctl -a -vvv -t open --context context:primary-signature src-tauri/target/release/bundle/dmg/MusicDay1_1.0.0_aarch64.dmg
```

如果保留 `bundle.createUpdaterArtifacts: true`，还需要设置 `TAURI_SIGNING_PRIVATE_KEY` 或 `TAURI_SIGNING_PRIVATE_KEY_PATH` 来生成自动更新包签名。

## 课程大纲

| 章节 | 内容 |
|------|------|
| 第一章：音乐入门 | 音的产生、音符与休止符、节拍与节奏 |
| 第二章：音高与音阶 | 音名唱名、半音全音、大调音阶、小调音阶 |
| 第三章：音程与和弦 | 音程计算、三和弦、七和弦与转位 |
| 第四章：调式与调性 | 调号规律、五度圈、近系调 |
| 第五章：读谱与综合 | 五线谱基础、演奏记号、和弦进行、综合考核 |

## 项目结构

```
musicDay1/
├── src/                    # 前端源码
│   ├── components/         # UI 组件
│   ├── pages/             # 页面（首页/课程/测验/进度/钢琴）
│   ├── data/              # 课程数据与测验题库
│   ├── hooks/             # 自定义 Hooks
│   ├── context/           # React Context
│   ├── types/             # TypeScript 类型定义
│   └── App.tsx            # 路由配置
├── src-tauri/             # Tauri / Rust 后端
│   ├── src/
│   ├── icons/
│   ├── Cargo.toml
│   └── tauri.conf.json
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 开源协议

MIT
