---
title: "Obsidian + 大模型个人第二大脑知识库管线"
description: "将 99+ 篇双链笔记转化为可检索的局部向量索引，实现本地优先（Local-First）的个人智能问答与灵感关联。"
category: "GenAI Interactive"
date: 2026-02-15
featured: false
cover: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop"
coCreation:
  humanShare: 40
  aiShare: 60
  models:
    - "Gemini 1.5 Pro"
    - "Claude 3.5 Sonnet"
    - "Cursor"
  humanRole: "知识图谱分类规则、信息架构分层、Prompt 上下文注入策略"
  aiRole: "Markdown AST 解析、元数据清洗脚本、向量嵌入切片管道"
demoUrl: "https://clawrere.github.io/posts"
githubUrl: "https://github.com/ClawRere"
tags:
  - "Obsidian"
  - "RAG"
  - "Knowledge Base"
  - "Python"
---

# Obsidian + 大模型个人第二大脑知识库管线

解决知识笔记沉淀后“写过即忘、难以交叉唤醒”的长期痛点。

## 产品设计与思考

- **双链知识网络**：通过 Obsidian 双链结构映射领域认知。
- **本地优先原则**：保证个人核心笔记与隐私数据不出本地，仅通过向量化索引供大模型检索调用。

