import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Cpu, Layers, Terminal, BookOpen, ExternalLink, Play, Star, Wand2 } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { CoCreationBadge } from './CoCreationBadge';

export const BentoGrid: React.FC = () => {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simOutput, setSimOutput] = useState('点击下方示例 Prompt 或输入目标，体验人机协同代码架构输出...');

  const samplePrompts = [
    {
      label: 'PMOS 需求基线分析',
      prompt: '作为 AI 产品经理，评估 PRD 变更对原型交互与版本基线的影响，并输出影响面分析矩阵。',
      response: '✓ 提取需求变更点：新增 @生成物 定向更新\n✓ 评估影响面：影响 PRD 第 3.2 节及原型状态机\n✓ 生成版本修订标记：r2 -> r3，发起同步授权',
    },
    {
      label: '实时流式音频管线',
      prompt: '基于 Faster-Whisper 与 WebSockets 搭建实时音频流转写管线，要求延迟低于 500ms。',
      response: '✓ VAD 静音切分算法就绪\n✓ WebSocket 双工推流建立\n✓ 中英文混合标点自动恢复完成',
    },
    {
      label: 'Apple Spotlight 动效',
      prompt: '编写一个带有鼠标光影追踪、高斯模糊毛玻璃与平滑物理弹簧阻尼的 React Bento Grid 卡片。',
      response: '✓ 计算光标相对坐标 (clientX - rect.left)\n✓ 叠加径向渐变蒙版 (Radial Gradient)\n✓ 绑定 Framer Motion 弹簧动画',
    },
  ];

  const handleRunSim = (index: number) => {
    setActivePromptIndex(index);
    setIsRunningSim(true);
    setSimOutput('AI 架构师正在思考并推演...');
    setTimeout(() => {
      setSimOutput(samplePrompts[index].response);
      setIsRunningSim(false);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
      {/* 1. Main Hero Profile Card (Spans 2 cols, 2 rows on desktop) */}
      <SpotlightCard className="md:col-span-2 lg:col-span-2 flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-cream-100/80 via-cream-50/50 to-terracotta-50/20 dark:from-obsidian-card dark:via-obsidian dark:to-obsidian-border border-terracotta/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-mono mb-4 border border-terracotta/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Product Manager · Builder
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-DEFAULT dark:text-cream-50 leading-[1.18]">
            用产品思维定义人机边界，<br />
            以 <span className="text-terracotta italic font-normal">AI 共创</span> 打造数字花园。
          </h1>

          <p className="mt-4 text-xs sm:text-sm text-charcoal-100 dark:text-cream-300 leading-relaxed max-w-lg font-serif">
            我是磊大大（Larry）。专注于 AI 工作台、交互原型与知识库产品的全链路闭环。从 Hexo 沉淀的 99+ 篇技术长文与 93 个原生动效出发，构建现代人机共创操作系统。
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/portfolio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-white font-medium text-xs sm:text-sm hover:bg-terracotta-500 shadow-glow-terracotta transition-all duration-200"
          >
            浏览作品集与 PMOS
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="/posts"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass hover:bg-cream-200 dark:hover:bg-obsidian-hover text-charcoal-DEFAULT dark:text-cream-100 font-medium text-xs sm:text-sm transition-all duration-200"
          >
            <BookOpen className="w-4 h-4 text-terracotta" />
            个人技术博客 (99+)
          </a>
        </div>
      </SpotlightCard>

      {/* 2. Flagship PMOS Showcase Card (Spans 2 cols) */}
      <SpotlightCard className="md:col-span-1 lg:col-span-2 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-terracotta flex items-center gap-1.5 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              核心产品 · PMOS V0.2
            </span>
            <span className="text-xs font-mono text-terracotta font-medium">Flagship</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-charcoal-DEFAULT dark:text-cream-50">
            面向产品经理的 AI 协作工作台
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-charcoal-100 dark:text-cream-300 leading-relaxed">
            把需求讨论中的证据、确认、决策与变更，持续绑定到 PRD、可操作 HTML 原型和上线基线。
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-charcoal-500/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CoCreationBadge humanShare={45} aiShare={55} models={['Claude 3.5 Sonnet', 'Vue 3 + FastAPI']} />
          <a
            href="/portfolio"
            className="text-xs font-mono font-medium text-terracotta hover:underline inline-flex items-center gap-1"
          >
            查看 PRD 与架构复盘 →
          </a>
        </div>
      </SpotlightCard>

      {/* 3. Interactive Prompt Playground Simulator (Spans 2 cols) */}
      <SpotlightCard className="md:col-span-2 lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-charcoal-DEFAULT dark:text-cream-100">
              人机协同推演场 (Prompt Sandbox)
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
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'glass text-charcoal-200 dark:text-cream-400 hover:text-charcoal'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Console Box */}
        <div className="p-3.5 rounded-xl bg-charcoal-900 text-cream-200 font-mono text-xs leading-relaxed min-h-[95px] border border-white/5 relative overflow-hidden">
          <div className="text-[10px] text-terracotta mb-1 flex items-center gap-1">
            <Play className="w-2.5 h-2.5" /> TASK: {samplePrompts[activePromptIndex].prompt.slice(0, 36)}...
          </div>
          <pre className="whitespace-pre-wrap text-emerald-300">
            {simOutput}
          </pre>
        </div>
      </SpotlightCard>

      {/* 4. Visual Effects 93+ Portal Card */}
      <SpotlightCard className="flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 text-terracotta mb-2">
            <Wand2 className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">原生动效实验室</span>
          </div>
          <div className="text-3xl font-serif font-bold text-charcoal-DEFAULT dark:text-cream-50">
            93<span className="text-terracotta text-xl font-normal">+</span>
          </div>
          <p className="text-xs text-charcoal-100 dark:text-cream-400 mt-1">
            收录 3D警车、海底泡泡、彩色时钟等原生 HTML/CSS/JS 独立沙盒
          </p>
        </div>
        <a
          href="/effects"
          className="mt-4 text-xs font-mono font-medium text-terracotta hover:underline inline-flex items-center gap-1"
        >
          进入特效展厅 →
        </a>
      </SpotlightCard>

      {/* 5. Knowledge Base Stats Card */}
      <SpotlightCard className="flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">技术知识库</span>
          </div>
          <div className="text-3xl font-serif font-bold text-charcoal-DEFAULT dark:text-cream-50">
            99<span className="text-amber-500 text-xl font-normal">+</span>
          </div>
          <p className="text-xs text-charcoal-100 dark:text-cream-400 mt-1">
            涵盖 AI 工具评测、大模型部署、5W1H 原则与全栈开发实践
          </p>
        </div>
        <a
          href="/posts"
          className="mt-4 text-xs font-mono font-medium text-terracotta hover:underline inline-flex items-center gap-1"
        >
          探索技术博客 →
        </a>
      </SpotlightCard>
    </div>
  );
};
