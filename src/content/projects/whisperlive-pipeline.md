---
title: "WhisperLive 实时流式语音转写与数字人管线"
description: "基于 Faster-Whisper、WebSockets 与 VAD 静音切分算法，打造端到端延迟低于 500ms 的实时语音交互管线。"
category: "Fullstack Experiment"
date: 2026-03-10
featured: true
cover: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
coCreation:
  humanShare: 30
  aiShare: 70
  models:
    - "Claude 3.5 Sonnet"
    - "PyTorch"
  humanRole: "音频流协议设计、VAD 阈值调优、GPU 显存占用压测"
  aiRole: "Faster-Whisper C++ 绑定封装、WebSocket 双工流服务编写"
demoUrl: "https://clawrere.github.io"
githubUrl: "https://github.com/ClawRere"
tags:
  - "Whisper"
  - "PyTorch"
  - "Audio"
  - "WebSocket"
---

# WhisperLive 实时流式语音转写管线

结合本地 CUDA 加速与高性能推流协议，实现低开销语音输入与文本对齐。

## 人机协作复盘

- **人类架构师**：重点突破 VAD 静音切分算法与并发音频帧的内存泄露。
- **AI 智能体**：快速生成 Python 异步服务端与客户端 Web Audio API 捕获脚本。
