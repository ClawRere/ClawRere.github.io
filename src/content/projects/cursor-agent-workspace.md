---
title: "Cursor & Claude 协同构建的智能工程实验场"
description: "基于提示词驱动的敏捷全栈开发范式，实现人机协同 10 倍速交付与架构自动演化。"
category: "AI Agent"
date: 2026-03-15
featured: false
hidden: true
cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
coCreation:
  humanShare: 25
  aiShare: 75
  models:
    - "Claude 3.5 Sonnet"
    - "Cursor"
  humanRole: "设计模式规划、领域业务拆解、边缘条件评审"
  aiRole: "React 组件树生成、TypeScript 类型推导、测试用例补全"
demoUrl: "https://clawrere.github.io"
githubUrl: "https://github.com/ClawRere"
tags:
  - "Cursor"
  - "Agent"
  - "Prompt Engineering"
  - "Next.js"
---

# Cursor & Claude 协同构建的智能工程实验场

本项目探索在现代大型模型辅助下，如何将一个初级想法在几个小时内转化为高完成度的产品级工程。

## 协作分工复盘

- **人类（25%）**：负责全局架构决策、选型评审、Prompt 精确构造与安全边界控制。
- **AI 智能体（75%）**：负责快速生成原子组件代码、Tailwind 样式微调、状态机逻辑编写以及错误日志自愈分析。

## 关键提示词模式 (Prompt Pattern)

```markdown
你是一名顶尖全栈架构师。请为项目设计一个无状态的 SpotlightCard 组件：
1. 鼠标悬停时跟踪计算 (x, y) 相对卡片边框的位移。
2. 动态渲染径向渐变 (Radial Gradient) 模拟高光跟随，颜色需符合 warm terracotta 色系。
3. 保证在深色/浅色模式下自然融入毛玻璃背景中。
```

## 成果与反思

通过结构化的规范约束与类型定义，AI 生成代码的采纳率由传统补全的 40% 提升至 92%，极大降低了心智负担。


