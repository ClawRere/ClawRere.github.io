import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ExternalLink, Play, X, Maximize2, Eye, Box, Loader2, Gamepad2, MousePointerClick, Component } from 'lucide-react';
import effectsData from '@/data/effects.json';

interface EffectItem {
  title: string;
  path: string;
  image: string;
  category: string;
}

const CATEGORY_STYLES: Record<string, { gradient: string; Icon: React.ComponentType<{ className?: string }> }> = {
  '3D视觉': { gradient: 'from-violet-600/25 via-indigo-500/15 to-cyan-500/20', Icon: Box },
  '趣味动效': { gradient: 'from-rose-500/25 via-amber-500/15 to-orange-500/20', Icon: Sparkles },
  '加载动画': { gradient: 'from-sky-500/25 via-blue-500/15 to-indigo-500/20', Icon: Loader2 },
  'UI交互': { gradient: 'from-emerald-500/25 via-teal-500/15 to-cyan-500/20', Icon: MousePointerClick },
  '互动游戏': { gradient: 'from-amber-500/25 via-orange-500/15 to-red-500/20', Icon: Gamepad2 },
  '实用组件': { gradient: 'from-fuchsia-500/25 via-purple-500/15 to-pink-500/20', Icon: Component },
};

export const EffectsShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalEffect, setActiveModalEffect] = useState<EffectItem | null>(null);
  const [inlinePreviewPaths, setInlinePreviewPaths] = useState<Record<string, boolean>>({});

  const categories = ['全部', '3D视觉', '趣味动效', '加载动画', 'UI交互', '互动游戏', '实用组件'];

  const filteredEffects = useMemo(() => {
    return (effectsData as EffectItem[]).filter((item) => {
      const matchCat = selectedCategory === '全部' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.path.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const toggleInlinePreview = (path: string) => {
    setInlinePreviewPaths((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 relative overflow-hidden bg-gradient-to-br from-cream-100/60 via-amber-50/20 to-terracotta-50/20 dark:from-obsidian-card dark:to-obsidian">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-terracotta mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Creative Code & Visual FX Showroom
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-DEFAULT dark:text-cream-50">
              原生 Web 特效与互动实验室
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-charcoal-100 dark:text-cream-300 max-w-xl leading-relaxed">
              汇集原博客珍藏的 <strong>{effectsData.length} 个</strong> 原生 HTML+CSS+JS 独立动效。点击「实时预览」直接在卡片内运行，或点击「网页内试玩」放大体验。
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl glass border border-terracotta/20 text-center font-mono shrink-0">
            <span className="block text-2xl font-bold font-serif text-terracotta">{effectsData.length}</span>
            <span className="text-[10px] text-charcoal-100 dark:text-cream-400">总计收录</span>
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
          </button>
        ))}
      </div>

      {/* 3. Visual Effects Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEffects.map((effect) => {
          const styleCfg = CATEGORY_STYLES[effect.category] || CATEGORY_STYLES['趣味动效'];
          const Icon = styleCfg.Icon;
          const isLive = !!inlinePreviewPaths[effect.path];

          return (
            <div
              key={effect.title + effect.path}
              className="group flex flex-col rounded-2xl glass overflow-hidden border border-charcoal-500/10 dark:border-white/10 hover:border-terracotta/40 dark:hover:border-terracotta/40 hover:shadow-2xl transition-all duration-300"
            >
              {/* Preview Window: Live Iframe on demand OR Clean Styled Card */}
              <div className={`h-52 w-full relative overflow-hidden bg-gradient-to-br ${styleCfg.gradient} flex items-center justify-center`}>
                {isLive ? (
                  <iframe
                    src={effect.path}
                    title={effect.title}
                    className="w-full h-full border-0 bg-zinc-950"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/15 dark:bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-terracotta group-hover:scale-110 transition-transform shadow-lg">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-xs font-mono text-charcoal-200 dark:text-cream-200 opacity-80">
                      {effect.path}
                    </div>
                  </div>
                )}

                {/* Category Pill */}
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-mono font-medium text-charcoal-DEFAULT dark:text-cream-100 shadow-sm pointer-events-none">
                  {effect.category}
                </span>

                {/* Action buttons */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                  <button
                    onClick={() => toggleInlinePreview(effect.path)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono flex items-center gap-1 shadow-md transition-all ${
                      isLive
                        ? 'bg-zinc-900/90 text-white border border-white/20'
                        : 'bg-white/90 dark:bg-black/80 text-charcoal-DEFAULT dark:text-cream-100 hover:bg-terracotta hover:text-white'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    {isLive ? '关闭预览' : '直接看效果'}
                  </button>
                  <button
                    onClick={() => setActiveModalEffect(effect)}
                    className="px-2.5 py-1.5 rounded-xl bg-terracotta text-white text-[11px] font-mono flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    放大试玩
                  </button>
                </div>
              </div>

              {/* Card Info Bottom */}
              <div className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-medium text-charcoal-DEFAULT dark:text-cream-50 group-hover:text-terracotta transition-colors truncate">
                    {effect.title}
                  </h3>
                  <span className="text-[11px] font-mono text-charcoal-100 dark:text-cream-400">
                    {effect.category}
                  </span>
                </div>

                <a
                  href={effect.path}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-charcoal-100 dark:text-cream-400 hover:text-terracotta hover:bg-terracotta/10 transition-colors shrink-0"
                  title="新标签页全屏打开"
                >
                  <Maximize2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Live Interactive Modal Player */}
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
                  <a
                    href={activeModalEffect.path}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg glass hover:text-terracotta text-xs font-mono flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    全屏独立运行
                  </a>
                  <button
                    onClick={() => setActiveModalEffect(null)}
                    className="p-1.5 rounded-lg glass hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full h-full relative bg-black/5">
                <iframe
                  src={activeModalEffect.path}
                  className="w-full h-full border-0"
                  title={activeModalEffect.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
