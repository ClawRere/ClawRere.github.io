# ✦ Larry's Digital Garden & AI Co-Creation Portfolio

> 这是一个面向 **AI 协同时代** 重写的现代化个人作品集与知识库。
> 融合 **Claude 风格的温润人文叙事感** 与 **Apple 风格的极致流体动效（Bento Grid、Spotlight 光影跟随、macOS 悬浮 Dock）**。

## 🌟 核心特性

- ⚡ **Astro 5 核心**：0-JS 极速首屏加载，内容驱动，完全解耦。
- 🎨 **Claude × Apple 美学系统**：暖米/黑曜岩高级配色、Newsreader 人文衬线标题、磨砂玻璃与微米级光影。
- 🤖 **人机共创作品集矩阵**：独创的 Human-AI 协作比例、提示词工程（Prompt Compare）与思维链折叠（Thinking Accordion）展示。
- 📚 **全量知识库继承**：原生支持 Markdown / MDX，继承沉淀的技术长文。
- 🧭 **AI 极度友好（AI-Native）**：内置 [`AGENTS.md`](./AGENTS.md)，详尽的模块权属表，未来 AI Agent 分块更新只需读取局部文件。

## 📁 核心架构速览

```
src/
├── components/
│   ├── ui/          # 原子级 UI 组件 (SpotlightCard, FloatingDock, ThemeToggle)
│   └── portfolio/   # 作品集业务组件 (BentoGrid, CoCreationBadge, PromptCompare, ThinkingAccordion)
├── content/
│   ├── posts/       # 知识库文章 Markdown
│   └── projects/    # AI 共创作品 Markdown
├── content.config.ts# Zod 严格类型校验 Schema
├── layouts/         # 全局页面壳 (Layout.astro, ViewTransitions)
├── pages/           # 路由页面 (/, /portfolio, /posts, /effects, /about)
└── styles/          # 全局样式与设计 Token (global.css)
```

## 🚀 启动与构建

```bash
# 安装依赖
npm install

# 本地调试
npm run dev

# 静态打包 (输出至 dist 目录，可直接部署至 GitHub Pages)
npm run build
```

---
*Created by Larry & Co-created with Claude, Gemini and Cursor.*
