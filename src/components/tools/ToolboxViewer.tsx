import React, { useState } from 'react';
import { Newspaper, Wrench, Bookmark, Sparkles, ExternalLink, RefreshCw, Code2 } from 'lucide-react';

interface ToolTab {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  src?: string;
  externalUrl?: string;
  type: 'iframe' | 'devtoys';
}

const TOOL_TABS: ToolTab[] = [
  {
    id: 'daily-news',
    label: '今日 AI 早报',
    emoji: '📰',
    desc: 'HackerNews & 科技头条每日聚合 (SuperTechFans)',
    src: 'https://www.supertechfans.com/cn',
    externalUrl: 'https://www.supertechfans.com/cn',
    type: 'iframe',
  },
  {
    id: 'hot-rank',
    label: '速知热榜',
    emoji: '🔥',
    desc: '全网热点与前沿资讯速览',
    src: 'https://suzhi.fun/',
    externalUrl: 'https://suzhi.fun/',
    type: 'iframe',
  },
  {
    id: 'recommend',
    label: 'AI 工具精选',
    emoji: '🛠️',
    desc: 'Cursor · Claude · Faster-Whisper · Obsidian 效率矩阵',
    src: '/tools/recommend',
    externalUrl: '/tools/recommend',
    type: 'iframe',
  },
  {
    id: 'links-pip',
    label: '108+ 灵感导航',
    emoji: '🔖',
    desc: '设计灵感、壁纸、图标库与 AGI 知识库直达',
    src: '/links',
    externalUrl: '/links',
    type: 'iframe',
  },
  {
    id: 'devtoys',
    label: '在线小工具',
    emoji: '⚡',
    desc: 'JSON 格式化 · 文本字数统计 · Base64 编解码（本地秒开）',
    type: 'devtoys',
  },
];

export const ToolboxViewer: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('daily-news');
  const [reloadKey, setReloadKey] = useState<number>(0);

  // Built-in quick DevToys state
  const [inputText, setInputText] = useState('{\n  "product": "PMOS",\n  "version": "V0.2",\n  "role": "AI Product Manager"\n}');
  const [outputText, setOutputText] = useState('');

  const activeTab = TOOL_TABS.find((t) => t.id === activeId) || TOOL_TABS[0];

  const formatJson = () => {
    try {
      setOutputText(JSON.stringify(JSON.parse(inputText), null, 2));
    } catch (e: any) {
      setOutputText(`JSON 解析失败: ${e.message}`);
    }
  };

  const encodeBase64 = () => {
    try {
      setOutputText(btoa(unescape(encodeURIComponent(inputText))));
    } catch (e: any) {
      setOutputText(`编码失败: ${e.message}`);
    }
  };

  const decodeBase64 = () => {
    try {
      setOutputText(decodeURIComponent(escape(atob(inputText.trim()))));
    } catch (e: any) {
      setOutputText(`解码失败: ${e.message}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TOOL_TABS.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveId(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                  isActive
                    ? 'bg-terracotta text-white border-terracotta shadow-md'
                    : 'border-charcoal-500/15 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 text-charcoal-200 dark:text-cream-300 hover:border-terracotta/40 hover:text-terracotta'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-charcoal-100 dark:text-cream-400 hidden lg:inline">
          {activeTab.desc}
        </span>
      </div>

      {/* Single Large Picture-in-Picture Frame */}
      <div className="rounded-3xl border border-charcoal-500/10 dark:border-white/10 overflow-hidden bg-white/60 dark:bg-zinc-900/70 backdrop-blur-xl shadow-2xl flex flex-col h-[75vh] min-h-[540px]">
        {/* Window Title Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-charcoal-500/10 dark:border-white/10 bg-cream-100/80 dark:bg-zinc-950/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            <span className="text-xs font-mono text-charcoal-DEFAULT dark:text-cream-100 truncate">
              {activeTab.emoji} {activeTab.label} — {activeTab.desc}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTab.type === 'iframe' && (
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-charcoal-100 dark:text-cream-400 hover:text-terracotta transition-colors"
                title="刷新画中画"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
            {activeTab.externalUrl && (
              <a
                href={activeTab.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-terracotta/10 text-terracotta hover:bg-terracotta/20 text-xs font-mono transition-colors"
              >
                <span>独立窗口</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Single Active Content */}
        {activeTab.type === 'iframe' ? (
          <iframe
            key={`${activeTab.id}-${reloadKey}`}
            src={activeTab.src}
            title={activeTab.label}
            className="w-full flex-1 border-0 bg-white dark:bg-zinc-950"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        ) : (
          <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-charcoal-DEFAULT dark:text-cream-100">输入文本 / JSON</span>
                <span className="text-[11px] font-mono text-charcoal-100 dark:text-cream-400">
                  字符: {inputText.length} · 行数: {inputText.split('\n').length}
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 min-h-[260px] p-4 rounded-2xl border border-charcoal-500/15 dark:border-white/10 bg-white/80 dark:bg-black/40 font-mono text-xs text-charcoal-DEFAULT dark:text-cream-100 focus:outline-none focus:border-terracotta"
              />
              <div className="flex flex-wrap gap-2">
                <button onClick={formatJson} className="px-3.5 py-1.5 rounded-xl bg-terracotta text-white text-xs font-mono hover:opacity-90">JSON 格式化</button>
                <button onClick={encodeBase64} className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-mono hover:opacity-90">Base64 编码</button>
                <button onClick={decodeBase64} className="px-3.5 py-1.5 rounded-xl bg-zinc-700 text-white text-xs font-mono hover:opacity-90">Base64 解码</button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono font-semibold text-charcoal-DEFAULT dark:text-cream-100">输出结果</span>
              <pre className="flex-1 min-h-[260px] p-4 rounded-2xl border border-charcoal-500/15 dark:border-white/10 bg-zinc-950 text-emerald-300 font-mono text-xs overflow-auto whitespace-pre-wrap">
                {outputText || '点击左侧按钮查看处理结果...'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
