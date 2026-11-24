# 🤖 AGENTS.md — AI 协同分块更新与阅读指南 (AI Reading & Chunk Update Guide)

> **致未来的 AI 助手（Cursor, Claude, Copilot, Gemini, DeepSeek 等）：**
> 本项目采用 **模块化与孤岛架构（Astro 5 + React + Tailwind）** 设计。**你无需阅读所有代码文件！** 请按照下方的「任务路由表」，按需精准读取指定文件即可完成修改。

---

## 🧭 1. 任务路由与最小上下文索引表 (Task Routing Map)

| 你的任务目标 | 只需要读取/修改的文件 | 不需要碰的文件（避免读取） |
| :--- | :--- | :--- |
| **新增/更新作品集项目** | `src/content/projects/*.md` | `src/pages/**`, `src/components/**` |
| **新增/修改技术博客文章** | `src/content/posts/*.md` | `src/pages/**`, `src/components/**` |
| **调整作品集元数据字段规范** | `src/content.config.ts` | 任何样式文件或具体页面 |
| **修改全局主题色/调色盘/动效** | `tailwind.config.mjs`, `src/styles/global.css` | 任何组件文件 |
| **调整首页 Bento Grid 布局** | `src/components/portfolio/BentoGrid.tsx` | 博客与文章文件 |
| **调整导航栏链接或悬浮底栏** | `src/components/ui/FloatingDock.tsx` | 布局与内容文件 |
| **修改光影跟随卡片 (Spotlight)** | `src/components/ui/SpotlightCard.tsx` | 其他任何文件 |
| **修改人机协作比例/徽章展示** | `src/components/portfolio/CoCreationBadge.tsx` | 内容与页面文件 |
| **修改 Claude 风格思考折叠框** | `src/components/portfolio/ThinkingAccordion.tsx`| 其他组件 |

---

## 🛠️ 2. 常见更新工作流标准模版

### 任务 A：如何新增一个作品集项目 (Add a Project)
👉 **操作范围**：直接在 `src/content/projects/` 新建一个 Markdown 文件（例如 `my-ai-tool.md`），填入以下 Frontmatter 即可，**无需修改任何页面或列表代码**，系统会自动渲染：

```markdown
---
title: "项目名称"
description: "一句话项目简介，阐明解决了什么问题"
category: "AI Agent" # 可选值: 'AI Agent' | 'GenAI Interactive' | 'Fullstack Experiment' | 'Visual Effects'
date: 2026-03-20
featured: true # 是否展示在首页精选
cover: "https://example.com/cover.jpg"
coCreation:
  humanShare: 30 # 人类占比 (0-100)
  aiShare: 70    # AI 占比 (0-100)
  models:
    - "Claude 3.5 Sonnet"
    - "Cursor"
  humanRole: "提示工程构造、架构契约设计、边缘异常测试"
  aiRole: "React 组件代码生成、Tailwind 样式推导、状态机编写"
demoUrl: "https://demo.example.com" # 可选
githubUrl: "https://github.com/username/repo" # 可选
tags:
  - "Next.js"
  - "Agent"
---

# 这里书写项目的正文复盘
- 背景与痛点
- 关键 Prompt 与人机协作细节
- 架构演进与思考
```

---

### 任务 B：如何新增一篇技术笔记 (Add a Post)
👉 **操作范围**：直接在 `src/content/posts/` 新建 Markdown 文件：

```markdown
---
title: "文章标题"
date: 2026-03-20
categories: "个人笔记" # 或数组 ["AI", "全栈"]
tags:
  - "Cursor"
  - "Prompt"
description: "文章摘要"
author: "Larry"
---

文章正文（标准 Markdown 语法，代码块请标注语言如 ```python 或 ```tsx 以获得最佳代码高亮）。
```

---

### 任务 C：如何新增或调整可交互 UI 组件
👉 **操作范围**：
1. 通用原子 UI 组件放在 `src/components/ui/`
2. 作品集相关组件放在 `src/components/portfolio/`
3. 必须包含 TypeScript Props 接口定义，遵循无状态或内部受控原则，保持单一职责。

---

## 🎨 3. 设计 Token 速查（Claude & Apple 风格指南）

- **背景主色**：
  - 浅色：`bg-cream-50` (`#FAF7F2`) 暖米色
  - 深色：`bg-obsidian` (`#141413`) 暖深黑
- **强调色**：
  - 陶土暖橙：`text-terracotta` / `bg-terracotta` (`#D97757`)
  - 琥珀色：`text-amber-500`
- **磨砂玻璃类名**：`glass`（带模糊微光与边框）、`glass-pill`（圆角药丸悬浮栏）
- **字体**：
  - 标题与大字号：`font-serif`（Newsreader 人文衬线体）
  - 正文与界面：`font-sans`（苹果极简无衬线体）
  - 代码与元数据：`font-mono`（JetBrains Mono 等宽字体）

---

## ⚡ 4. 构建与测试命令

```bash
# 启动本地实时热重载开发服务器
npm run dev

# 编译纯静态 HTML 产物（用于 GitHub Pages 部署）
npm run build

# 本地预览编译后的静态站点
npm run preview
```
