import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Plus, X } from 'lucide-react';

export interface ToolTab {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  src?: string;
  externalUrl?: string;
  type: 'iframe' | 'devtoys';
}

const DEFAULT_TOOL_TABS: ToolTab[] = [
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
    id: 'futurepedia',
    label: 'AI 工具导航',
    emoji: '🤖',
    desc: '全球最新 AI 生产力工具与评测榜单',
    src: 'https://www.futurepedia.io/',
    externalUrl: 'https://www.futurepedia.io/',
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
  const [tabs, setTabs] = useState<ToolTab[]>(DEFAULT_TOOL_TABS);
  const [activeId, setActiveId] = useState<string>('daily-news');
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTool, setNewTool] = useState({ label: '', emoji: '🧰', desc: '', src: '' });
  const [pipVh, setPipVh] = useState(78);
  const [savedNotice, setSavedNotice] = useState(false);

  // Built-in quick DevToys state
  const [inputText, setInputText] = useState('{\n  "product": "PMOS",\n  "version": "V0.2",\n  "role": "AI Product Manager"\n}');
  const [outputText, setOutputText] = useState('');

  useEffect(() => {
    setIsAdmin(localStorage.getItem('admin_authenticated') === 'true');
    const savedVh = parseInt(localStorage.getItem('layout_pip_vh') || '78', 10);
    if (!isNaN(savedVh)) setPipVh(savedVh);
    const saved = localStorage.getItem('custom_tools');
    if (saved) {
      try {
        const custom: ToolTab[] = JSON.parse(saved);
        if (Array.isArray(custom) && custom.length > 0) {
          setTabs([...DEFAULT_TOOL_TABS, ...custom]);
        }
      } catch {}
    }
  }, []);

  const startResizePip = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const initVh = pipVh;
    const onMove = (ev: MouseEvent) => {
      const deltaVh = ((ev.clientY - startY) / window.innerHeight) * 100;
      const next = Math.max(45, Math.min(90, Math.round(initVh + deltaVh)));
      setPipVh(next);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const savePipSize = () => {
    localStorage.setItem('layout_pip_vh', String(pipVh));
    document.documentElement.style.setProperty('--pip-height', `${pipVh}vh`);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool.label.trim() || !newTool.src.trim()) return;
    const item: ToolTab = {
      id: `custom-${Date.now()}`,
      label: newTool.label.trim(),
      emoji: newTool.emoji.trim() || '🧰',
      desc: newTool.desc.trim() || newTool.src.trim(),
      src: newTool.src.trim(),
      externalUrl: newTool.src.trim(),
      type: 'iframe',
    };
    const saved = localStorage.getItem('custom_tools');
    const prev = saved ? JSON.parse(saved) : [];
    const updatedCustom = [...prev, item];
    localStorage.setItem('custom_tools', JSON.stringify(updatedCustom));
    setTabs([...DEFAULT_TOOL_TABS, ...updatedCustom]);
    setActiveId(item.id);
    setNewTool({ label: '', emoji: '🧰', desc: '', src: '' });
    setShowAddModal(false);
  };

  const activeTab = tabs.find((t) => t.id === activeId) || tabs[0];

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
    <div className="space-y-4">
      {/* Top Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveId(tab.id)}
                style={{ transform: 'scale(var(--pill-scale, 1))' }}
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
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono hover:bg-emerald-500/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> 新增工具
            </button>
          )}
        </div>

        <span className="text-xs font-mono text-charcoal-100 dark:text-cream-400 hidden lg:inline">
          {activeTab.desc}
        </span>
      </div>

      {/* Single Large Picture-in-Picture Frame */}
      <div
        style={{ height: `${pipVh}vh` }}
        className="relative rounded-3xl border border-charcoal-500/10 dark:border-white/10 overflow-hidden bg-white/60 dark:bg-zinc-900/70 backdrop-blur-xl shadow-2xl flex flex-col min-h-[420px]"
      >
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-charcoal-500/10 dark:border-white/10 bg-cream-100/80 dark:bg-zinc-950/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            <span className="text-xs font-mono text-charcoal-DEFAULT dark:text-cream-100 truncate">
              {activeTab.emoji} {activeTab.label}
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

      {/* Admin Direct On-Page Drag-to-Resize Bar */}
      {isAdmin && (
        <div className="flex items-center justify-center gap-3 pt-1">
          <div
            onMouseDown={startResizePip}
            className="px-4 py-1.5 rounded-full bg-zinc-900/85 text-white border border-white/15 text-xs font-mono cursor-ns-resize select-none shadow hover:border-terracotta transition-colors"
            title="按住上下拖拽实时调节画中画高度"
          >
            ↕ 拖拽调节画中画高度 ({pipVh}vh)
          </div>
          <button
            onClick={savePipSize}
            className="px-3.5 py-1.5 rounded-full bg-terracotta text-white text-xs font-mono hover:opacity-90 shadow"
          >
            {savedNotice ? '✓ 已保存' : '保存尺寸'}
          </button>
        </div>
      )}

      {/* Inline Admin Add Tool Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <form onSubmit={handleAddTool} className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">🛠️ 新增工具箱 Tab</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input type="text" placeholder="名称 *" required value={newTool.label} onChange={e => setNewTool({ ...newTool, label: e.target.value })} className="col-span-2 px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm" />
              <input type="text" placeholder="Emoji" value={newTool.emoji} onChange={e => setNewTool({ ...newTool, emoji: e.target.value })} className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm text-center" />
            </div>
            <input type="url" placeholder="内嵌网页 URL https://... *" required value={newTool.src} onChange={e => setNewTool({ ...newTool, src: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm" />
            <input type="text" placeholder="工具简述" value={newTool.desc} onChange={e => setNewTool({ ...newTool, desc: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm" />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-terracotta text-white text-xs font-mono font-semibold hover:opacity-90">保存并立即生效</button>
          </form>
        </div>
      )}
    </div>
  );
};
