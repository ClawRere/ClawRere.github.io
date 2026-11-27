import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  ExternalLink,
  Play,
  X,
  Maximize2,
  Eye,
  Box,
  Loader2,
  Gamepad2,
  MousePointerClick,
  Component,
  Plus,
  Copy,
  Check,
  Download,
  Trash2,
} from 'lucide-react';
import effectsData from '@/data/effects.json';

interface EffectItem {
  title: string;
  path: string;
  image: string;
  category: string;
  isCustom?: boolean;
  htmlCode?: string;
}

const CATEGORY_STYLES: Record<string, { gradient: string; Icon: React.ComponentType<{ className?: string }> }> = {
  '3D视觉': { gradient: 'from-violet-600/25 via-indigo-500/15 to-cyan-500/20', Icon: Box },
  '趣味动效': { gradient: 'from-rose-500/25 via-amber-500/15 to-orange-500/20', Icon: Sparkles },
  '加载动画': { gradient: 'from-sky-500/25 via-blue-500/15 to-indigo-500/20', Icon: Loader2 },
  'UI交互': { gradient: 'from-emerald-500/25 via-teal-500/15 to-cyan-500/20', Icon: MousePointerClick },
  '互动游戏': { gradient: 'from-amber-500/25 via-orange-500/15 to-red-500/20', Icon: Gamepad2 },
  '实用组件': { gradient: 'from-fuchsia-500/25 via-purple-500/15 to-pink-500/20', Icon: Component },
};

const LiveEffectFrame: React.FC<{ effect: EffectItem }> = ({ effect }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { rootMargin: '180px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      {isVisible ? (
        effect.htmlCode ? (
          <iframe
            srcDoc={effect.htmlCode}
            title={effect.title}
            className="w-full h-full border-0 bg-zinc-950 pointer-events-none"
            sandbox="allow-scripts"
          />
        ) : (
          <iframe
            src={effect.path}
            title={effect.title}
            className="w-full h-full border-0 bg-zinc-950 pointer-events-none"
            loading="lazy"
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs font-mono opacity-40">
          滚动加载实时视效...
        </div>
      )}
    </div>
  );
};

export const EffectsShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalEffect, setActiveModalEffect] = useState<EffectItem | null>(null);
  const [inlinePreviewPaths, setInlinePreviewPaths] = useState<Record<string, boolean>>({});
  const [customEffects, setCustomEffects] = useState<EffectItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [newEffect, setNewEffect] = useState({
    title: '',
    category: 'UI交互',
    path: '',
    htmlCode: '',
  });

  const categories = ['全部', '我的收藏', '3D视觉', '趣味动效', '加载动画', 'UI交互', '互动游戏', '实用组件'];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('custom_effects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCustomEffects(parsed);
      }
    } catch {}
  }, []);

  const allEffects = useMemo(() => {
    return [...customEffects, ...(effectsData as EffectItem[])];
  }, [customEffects]);

  const filteredEffects = useMemo(() => {
    return allEffects.filter((item) => {
      const matchCat =
        selectedCategory === '全部'
          ? true
          : selectedCategory === '我的收藏'
          ? !!item.isCustom
          : item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.path.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  }, [allEffects, selectedCategory, searchQuery]);

  const toggleInlinePreview = (key: string) => {
    setInlinePreviewPaths((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddEffect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEffect.title.trim()) return;
    if (!newEffect.path.trim() && !newEffect.htmlCode.trim()) return;

    const item: EffectItem = {
      title: newEffect.title.trim(),
      category: newEffect.category,
      path: newEffect.path.trim() || `custom-${Date.now()}`,
      image: '',
      isCustom: true,
      htmlCode: newEffect.htmlCode.trim() || undefined,
    };

    const updated = [item, ...customEffects];
    setCustomEffects(updated);
    localStorage.setItem('custom_effects', JSON.stringify(updated));
    setNewEffect({ title: '', category: 'UI交互', path: '', htmlCode: '' });
    setShowAddModal(false);
    setSelectedCategory('我的收藏');
  };

  const removeCustomEffect = (title: string, path: string) => {
    const updated = customEffects.filter((c) => !(c.title === title && c.path === path));
    setCustomEffects(updated);
    localStorage.setItem('custom_effects', JSON.stringify(updated));
  };

  const copyEmbedCode = (effect: EffectItem) => {
    const code = effect.htmlCode
      ? effect.htmlCode
      : `<iframe src="${effect.path}" class="w-full h-96 border-0" title="${effect.title}" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(code);
    setCopiedId(effect.title + effect.path);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCustomEffects = () => {
    const blob = new Blob([JSON.stringify(customEffects, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-frontend-effects.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* 1. Seamless Deep-Black Cosmic Header with Floating Planet (no explanation card) */}
      <div className="relative rounded-3xl overflow-hidden bg-[#050608] text-white px-6 py-5 sm:px-8 sm:py-6 shadow-2xl">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 76% 50%, rgba(56,189,248,0.12) 0%, rgba(15,23,42,0.45) 45%, #050608 78%)',
          }}
        />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              Creative Code & Visual FX Vault · {allEffects.length} Effects
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-terracotta hover:bg-terracotta/90 text-white text-xs font-mono font-semibold shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>收藏新动效</span>
              </button>
              {customEffects.length > 0 && (
                <button
                  onClick={exportCustomEffects}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出 ({customEffects.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Side: Black-Background Solar System Animation Blending Seamlessly */}
          <div className="lg:col-span-6 h-56 sm:h-64 relative overflow-hidden flex items-center justify-center">
            <iframe
              src="/effects/solar_animation/widget.html"
              title="太阳系行星运行动画"
              scrolling="no"
              className="w-full h-full border-0 bg-transparent pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Controls & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-100 dark:text-cream-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索特效名称 (例如: 3D, 飞机, 时钟, 泡泡)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl glass text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-50 placeholder:text-charcoal-100/60 dark:placeholder:text-cream-400/60 focus:outline-none focus:border-terracotta/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-100 dark:text-cream-400 hover:text-charcoal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs font-mono text-charcoal-100 dark:text-cream-400 self-center">
          当前展示 <strong className="text-terracotta">{filteredEffects.length}</strong> 个特效
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-charcoal-500/10 dark:border-white/10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-terracotta text-white shadow-glow-terracotta'
                : 'glass text-charcoal-200 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-obsidian-hover'
            }`}
          >
            {cat}
            {cat === '我的收藏' && ` (${customEffects.length})`}
          </button>
        ))}
      </div>

      {/* 3. Visual Effects Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEffects.map((effect) => {
          const styleCfg = CATEGORY_STYLES[effect.category] || CATEGORY_STYLES['趣味动效'];
          const Icon = styleCfg.Icon;
          const uniqueKey = effect.title + effect.path;
          const isLive = !!inlinePreviewPaths[uniqueKey];

          return (
            <div
              key={uniqueKey}
              className="group flex flex-col rounded-2xl glass overflow-hidden border border-charcoal-500/10 dark:border-white/10 hover:border-terracotta/40 dark:hover:border-terracotta/40 hover:shadow-2xl transition-all duration-300"
            >
              <div className={`h-52 w-full relative overflow-hidden bg-gradient-to-br ${styleCfg.gradient} flex items-center justify-center`}>
                <LiveEffectFrame effect={effect} />

                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-mono font-medium text-charcoal-DEFAULT dark:text-cream-100 shadow-sm pointer-events-none">
                  {effect.isCustom ? `⭐ ${effect.category}` : effect.category}
                </span>

                <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                  <button
                    onClick={() => setActiveModalEffect(effect)}
                    className="px-3 py-1.5 rounded-xl bg-terracotta text-white text-[11px] font-mono flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    放大试玩
                  </button>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-medium text-charcoal-DEFAULT dark:text-cream-50 group-hover:text-terracotta transition-colors truncate">
                    {effect.title}
                  </h3>
                  <span className="text-[11px] font-mono text-charcoal-100 dark:text-cream-400">
                    {effect.category}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => copyEmbedCode(effect)}
                    className="p-1.5 rounded-lg text-charcoal-100 dark:text-cream-400 hover:text-terracotta hover:bg-terracotta/10 transition-colors"
                    title="复制嵌入/复用代码"
                  >
                    {copiedId === uniqueKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {effect.isCustom && (
                    <button
                      onClick={() => removeCustomEffect(effect.title, effect.path)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="移除收藏"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {!effect.htmlCode && (
                    <a
                      href={effect.path}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-charcoal-100 dark:text-cream-400 hover:text-terracotta hover:bg-terracotta/10 transition-colors"
                      title="新标签页全屏打开"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Add / Store Effect Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleAddEffect}
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">✨ 收藏/储存新的前端动效</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="动效名称 *"
                required
                value={newEffect.title}
                onChange={(e) => setNewEffect({ ...newEffect, title: e.target.value })}
                className="px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
              />
              <select
                value={newEffect.category}
                onChange={(e) => setNewEffect({ ...newEffect, category: e.target.value })}
                className="px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm"
              >
                {['UI交互', '3D视觉', '趣味动效', '加载动画', '互动游戏', '实用组件'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="在线 Demo URL (如 CodePen / GitHub Pages / 本地路径，可与下方代码二选一)"
              value={newEffect.path}
              onChange={(e) => setNewEffect({ ...newEffect, path: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm font-mono"
            />

            <textarea
              rows={6}
              placeholder="或者直接粘贴完整 HTML + <style> + <script> 动效代码片段（支持即时沙盒运行与一键复用）"
              value={newEffect.htmlCode}
              onChange={(e) => setNewEffect({ ...newEffect, htmlCode: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono"
            />

            <button type="submit" className="w-full py-2.5 rounded-xl bg-terracotta text-white text-xs font-mono font-semibold hover:opacity-90">
              保存到前端动效库
            </button>
          </form>
        </div>
      )}

      {/* 5. Live Interactive Modal Player */}
      <AnimatePresence>
        {activeModalEffect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl h-[85vh] rounded-3xl glass overflow-hidden border border-white/20 shadow-2xl flex flex-col bg-cream-50 dark:bg-obsidian"
            >
              <div className="px-5 py-3.5 border-b border-charcoal-500/10 dark:border-white/10 flex items-center justify-between bg-cream-100/80 dark:bg-obsidian-card">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-serif font-medium text-sm sm:text-base text-charcoal-DEFAULT dark:text-cream-50">
                    {activeModalEffect.title}
                  </span>
                  <span className="text-xs font-mono text-terracotta">
                    ({activeModalEffect.category})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyEmbedCode(activeModalEffect)}
                    className="px-2.5 py-1.5 rounded-lg glass hover:text-terracotta text-xs font-mono flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> 复制复用代码
                  </button>
                  {!activeModalEffect.htmlCode && (
                    <a
                      href={activeModalEffect.path}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg glass hover:text-terracotta text-xs font-mono flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> 全屏运行
                    </a>
                  )}
                  <button
                    onClick={() => setActiveModalEffect(null)}
                    className="p-1.5 rounded-lg glass hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full h-full relative bg-black/5">
                {activeModalEffect.htmlCode ? (
                  <iframe
                    srcDoc={activeModalEffect.htmlCode}
                    className="w-full h-full border-0"
                    title={activeModalEffect.title}
                    sandbox="allow-scripts"
                  />
                ) : (
                  <iframe
                    src={activeModalEffect.path}
                    className="w-full h-full border-0"
                    title={activeModalEffect.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
