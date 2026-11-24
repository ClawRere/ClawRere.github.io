import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Cpu, Layers, Terminal, BookOpen, ExternalLink, Play } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { CoCreationBadge } from './CoCreationBadge';

export const BentoGrid: React.FC = () => {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simOutput, setSimOutput] = useState('点击下方示例 Prompt 或输入目标，体验人机协同代码架构输出...');

  const samplePrompts = [
    {
      label: '构建流式 AI 聊天组件',
      prompt: '作为资深全栈工程师，设计一个基于 Next.js App Router 与 Vercel AI SDK 的流式对话卡片，包含错误重试与代码高亮。',
      response: '✓ 已生成响应式 UI 骨架\n✓ 集成 useChat 流式钩子\n✓ 配置 Shiki 代码高亮与复制功能',
    },
    {
      label: 'Whisper 语音识别流水线',
      prompt: '使用 Faster-Whisper 与 WebSockets 搭建实时音频流转写管线，要求延迟低于 500ms 并自动分句。',
      response: '✓ VAD 静音切分算法就绪\n✓ WebSocket 双工推流建立\n✓ 中英文混合标点自动恢复完成',
    },
    {
      label: 'Apple 风格 Spotlight 动效',
      prompt: '编写一个带有鼠标光影追踪、高斯模糊毛玻璃与平滑物理弹簧阻尼的 React Bento Grid 卡片。',
      response: '✓ 计算光标相对坐标 (clientX - rect.left)\n✓ 叠加径向渐变蒙版 (Radial Gradient)\n✓ 绑定 Framer Motion 弹簧动画',
    },
  ];

  const handleRunSim = (index: number) => {
    setActivePromptIndex(index);
    setIsRunningSim(true);
    setSimOutput('AI 架构师正在思考并生成...');
    setTimeout(() => {
      setSimOutput(samplePrompts[index].response);
      setIsRunningSim(false);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
      {/* 1. Main Hero Profile Card (Spans 2 cols, 2 rows on desktop) */}
      <SpotlightCard className="md:col-span-2 lg:col-span-2 flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-cream-50/80 to-cream-100/50 dark:from-obsidian-card dark:to-obsidian">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono mb-4 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Co-creating with Claude & Gemini
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-charcoal-DEFAULT dark:text-cream-50 leading-[1.15]">
            探索技术沉淀，<br />
            与 <span className="text-terracotta italic font-normal">AI 共创</span> 的数字花园。
          </h1>

          <p className="mt-4 text-sm sm:text-base text-charcoal-100 dark:text-cream-300 leading-relaxed max-w-lg">
            我是磊大大（Larry）。从 Hexo 沉淀的 99+ 篇技术长文出发，重构为现代人机协同作品集。这里记录真实工程复盘、AI 智能体探索与灵动交互实验。
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/portfolio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-white font-medium text-sm hover:bg-terracotta-500 shadow-glow-terracotta transition-all duration-200"
          >
            浏览作品集
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="/posts"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass hover:bg-cream-200 dark:hover:bg-obsidian-hover text-charcoal-DEFAULT dark:text-cream-100 font-medium text-sm transition-all duration-200"
          >
            <BookOpen className="w-4 h-4 text-terracotta" />
            99+ 篇技术笔记
          </a>
        </div>
      </SpotlightCard>

      {/* 2. Top AI Co-creation Featured Work Card (Spans 2 cols) */}
      <SpotlightCard className="md:col-span-1 lg:col-span-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal-100 dark:text-cream-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              精选 AI 共创项目
            </span>
            <span className="text-xs font-mono text-terracotta">2026 Edition</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-medium text-charcoal-DEFAULT dark:text-cream-50">
            Cursor & Agent 驱动的智能知识流
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-charcoal-100 dark:text-cream-300 leading-relaxed">
            从自然语言指令到全功能前端动效与语音管线，打破传统开发边界，实现人机协同 10 倍速交付。
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-charcoal-500/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CoCreationBadge humanShare={25} aiShare={75} models={['Claude 3.5 Sonnet', 'Cursor']} />
          <a
            href="/portfolio"
            className="text-xs font-medium text-terracotta hover:underline inline-flex items-center gap-1"
          >
            查看复盘与 Demo
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </SpotlightCard>

      {/* 3. Interactive Prompt Playground Mini Simulator (Spans 2 cols on desktop) */}
      <SpotlightCard className="md:col-span-2 lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-charcoal-DEFAULT dark:text-cream-100">
              交互式协同模拟器 (Prompt Sandbox)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-charcoal-100 dark:text-cream-400">
            Live Preview
          </span>
        </div>

        {/* Prompt Selector Chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {samplePrompts.map((item, idx) => (
            <button
              key={item.label}
              onClick={() => handleRunSim(idx)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activePromptIndex === idx
                  ? 'bg-terracotta/10 text-terracotta border border-terracotta/30'
                  : 'bg-cream-200/50 dark:bg-obsidian-border text-charcoal-100 dark:text-cream-400 hover:text-charcoal'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Console Box */}
        <div className="p-3.5 rounded-xl bg-charcoal-900 text-cream-200 font-mono text-xs leading-relaxed min-h-[90px] border border-white/5 relative overflow-hidden">
          <div className="text-[10px] text-terracotta mb-1 flex items-center gap-1">
            <Play className="w-2.5 h-2.5" /> PROMPT: {samplePrompts[activePromptIndex].prompt.slice(0, 38)}...
          </div>
          <pre className="whitespace-pre-wrap text-emerald-300">
            {simOutput}
          </pre>
        </div>
      </SpotlightCard>

      {/* 4. Knowledge Base Stats Card */}
      <SpotlightCard className="flex flex-col justify-between">
        <div className="flex items-center gap-2 text-charcoal-100 dark:text-cream-400 mb-2">
          <BookOpen className="w-4 h-4 text-terracotta" />
          <span className="text-xs font-mono uppercase tracking-wider">知识库沉淀</span>
        </div>
        <div>
          <div className="text-4xl font-serif font-bold text-charcoal-DEFAULT dark:text-cream-50">
            99<span className="text-terracotta text-2xl font-normal">+</span>
          </div>
          <p className="text-xs text-charcoal-100 dark:text-cream-400 mt-1">
            涵盖 AI 工具、模型部署、Hexo/Web 全栈开发与方法论总结
          </p>
        </div>
        <a
          href="/posts"
          className="mt-4 text-xs font-medium text-terracotta hover:underline inline-flex items-center gap-1"
        >
          即刻检索文章库 →
        </a>
      </SpotlightCard>

      {/* 5. Co-creation Tech Stack Stacked Pills Card */}
      <SpotlightCard className="flex flex-col justify-between">
        <div className="flex items-center gap-2 text-charcoal-100 dark:text-cream-400 mb-2">
          <Layers className="w-4 h-4 text-terracotta" />
          <span className="text-xs font-mono uppercase tracking-wider">技术基因</span>
        </div>
        <div className="flex flex-wrap gap-1.5 my-2">
          {['Astro 5', 'Tailwind', 'React', 'Framer Motion', 'TypeScript', 'Gemini API', 'Claude', 'PyTorch'].map(
            (tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-cream-200/80 dark:bg-obsidian-border text-[11px] font-mono text-charcoal-200 dark:text-cream-300"
              >
                {tech}
              </span>
            )
          )}
        </div>
        <span className="text-[11px] text-charcoal-100 dark:text-cream-400">
          极简模块化 · 高灵动交互 · 0-JS 极速首屏
        </span>
      </SpotlightCard>
    </div>
  );
};
