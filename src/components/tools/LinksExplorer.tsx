import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Copy, Check, LayoutGrid, List, Monitor, X, Bookmark, Globe } from 'lucide-react';
import linksData from '@/data/links.json';

interface LinkItem {
  name: string;
  link: string;
  avatar: string;
  descr: string;
}

interface CategoryGroup {
  name: string;
  desc: string;
  links: LinkItem[];
}

export const LinksExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<'card' | 'compact' | 'split'>('card');
  const [previewLink, setPreviewLink] = useState<LinkItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const categories = useMemo(() => {
    return ['全部', ...(linksData as CategoryGroup[]).map((c) => c.name)];
  }, []);

  const allLinks = useMemo(() => {
    return (linksData as CategoryGroup[]).flatMap((c) =>
      c.links.map((l) => ({ ...l, category: c.name }))
    );
  }, []);

  const filteredLinks = useMemo(() => {
    return allLinks.filter((item) => {
      const matchCat = selectedCategory === '全部' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.descr.toLowerCase().includes(q) ||
        item.link.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [allLinks, selectedCategory, searchQuery]);

  const handleCopy = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleItemClick = (e: React.MouseEvent, item: LinkItem) => {
    if (layoutMode === 'split') {
      e.preventDefault();
      setPreviewLink(item);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 relative overflow-hidden bg-gradient-to-br from-cream-100/60 via-cream-50/30 to-amber-50/20 dark:from-obsidian-card dark:to-obsidian">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-terracotta mb-2 font-semibold">
              <Bookmark className="w-3.5 h-3.5" />
              Resource Directory & Bookmarks
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-DEFAULT dark:text-cream-50">
              精选资源与书签导航库
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-charcoal-100 dark:text-cream-300 max-w-xl leading-relaxed">
              沉淀 <strong>{allLinks.length} 个</strong> 优质站点与工具链接。支持自由切换<strong>沉浸卡片</strong>、<strong>紧凑单链</strong>或<strong>画中画内嵌预览</strong>三种布局。
            </p>
          </div>

          {/* Layout Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-2xl glass border border-charcoal-500/10 dark:border-white/10 bg-white/50 dark:bg-black/30">
            <button
              onClick={() => setLayoutMode('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                layoutMode === 'card' ? 'bg-terracotta text-white shadow-sm' : 'text-charcoal-100 dark:text-cream-400 hover:text-charcoal'
              }`}
              title="卡片网格模式"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>卡片</span>
            </button>
            <button
              onClick={() => setLayoutMode('compact')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                layoutMode === 'compact' ? 'bg-terracotta text-white shadow-sm' : 'text-charcoal-100 dark:text-cream-400 hover:text-charcoal'
              }`}
              title="紧凑单链模式"
            >
              <List className="w-3.5 h-3.5" />
              <span>单链</span>
            </button>
            <button
              onClick={() => setLayoutMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                layoutMode === 'split' ? 'bg-terracotta text-white shadow-sm' : 'text-charcoal-100 dark:text-cream-400 hover:text-charcoal'
              }`}
              title="画中画内嵌预览模式"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>画中画</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-100 dark:text-cream-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索书签标题、简介或网址..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl glass text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-50 placeholder:text-charcoal-100/60 dark:placeholder:text-cream-400/60 focus:outline-none focus:border-terracotta/50 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-100 hover:text-charcoal">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs font-mono text-charcoal-100 dark:text-cream-400 self-center">
          显示 <strong className="text-terracotta">{filteredLinks.length}</strong> / {allLinks.length} 个书签
        </span>
      </div>

      {/* Category Pills Bar */}
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

      {/* 3. Layout Rendering */}
      {layoutMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLinks.map((item, idx) => (
            <a
              key={item.name + idx}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="group p-5 rounded-2xl glass border border-charcoal-500/10 dark:border-white/10 hover:border-terracotta/40 dark:hover:border-terracotta/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cream-200 dark:bg-obsidian-border flex items-center justify-center overflow-hidden border border-charcoal-500/10 dark:border-white/10">
                    <img
                      src={item.avatar.startsWith('http') ? item.avatar : `https://www.google.com/s2/favicons?domain=${item.link}&sz=64`}
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-7 h-7 object-contain rounded-lg"
                    />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cream-200/60 dark:bg-obsidian-border text-[10px] font-mono text-charcoal-100 dark:text-cream-400">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-charcoal-DEFAULT dark:text-cream-50 group-hover:text-terracotta transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs text-charcoal-100 dark:text-cream-300 line-clamp-2 leading-relaxed">
                  {item.descr || '暂无描述'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-charcoal-500/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-charcoal-100 dark:text-cream-400">
                <span className="truncate max-w-[170px] text-[11px] opacity-75">{item.link.replace(/^https?:\/\//, '')}</span>
                <div className="flex items-center gap-1.5 text-terracotta">
                  <button
                    onClick={(e) => handleCopy(e, item.link)}
                    className="p-1 rounded hover:bg-terracotta/10 transition-colors"
                    title="复制链接"
                  >
                    {copiedUrl === item.link ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {layoutMode === 'compact' && (
        <div className="divide-y divide-charcoal-500/10 dark:divide-white/10 rounded-2xl glass border border-charcoal-500/10 dark:border-white/10 overflow-hidden">
          {filteredLinks.map((item, idx) => (
            <div
              key={item.name + idx}
              className="py-3 px-4 flex items-center justify-between gap-4 hover:bg-cream-100/50 dark:hover:bg-obsidian-card/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Globe className="w-4 h-4 text-terracotta shrink-0" />
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-100 hover:text-terracotta transition-colors truncate"
                >
                  {item.name}
                </a>
                <span className="hidden sm:inline text-xs text-charcoal-100 dark:text-cream-400 truncate max-w-xs">
                  - {item.descr}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                <span className="hidden md:inline px-2 py-0.5 rounded bg-cream-200/60 dark:bg-obsidian-border text-[10px] text-charcoal-100 dark:text-cream-400">
                  {item.category}
                </span>
                <button
                  onClick={(e) => handleCopy(e, item.link)}
                  className="p-1 rounded text-charcoal-100 hover:text-terracotta"
                  title="复制链接"
                >
                  {copiedUrl === item.link ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-terracotta hover:underline flex items-center gap-0.5"
                >
                  <span>访问</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {layoutMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 max-h-[75vh] overflow-y-auto divide-y divide-charcoal-500/10 dark:divide-white/10 rounded-2xl glass border border-charcoal-500/10 dark:border-white/10 pr-1">
            {filteredLinks.map((item, idx) => (
              <div
                key={item.name + idx}
                onClick={() => setPreviewLink(item)}
                className={`p-3.5 cursor-pointer flex items-center justify-between gap-2 transition-all ${
                  previewLink?.link === item.link
                    ? 'bg-terracotta/10 border-l-4 border-terracotta'
                    : 'hover:bg-cream-100/50 dark:hover:bg-obsidian-card/50'
                }`}
              >
                <div className="min-w-0">
                  <div className="font-medium text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-100 truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-charcoal-100 dark:text-cream-400 truncate mt-0.5">
                    {item.descr || item.link}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-terracotta shrink-0">预览 →</span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 h-[75vh] rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 overflow-hidden flex flex-col shadow-2xl bg-white dark:bg-black">
            {previewLink ? (
              <>
                <div className="px-4 py-3 border-b border-charcoal-500/10 dark:border-white/10 flex items-center justify-between bg-cream-100/80 dark:bg-obsidian-card text-xs font-mono">
                  <span className="font-bold truncate max-w-sm">{previewLink.name}</span>
                  <a
                    href={previewLink.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-terracotta hover:underline flex items-center gap-1"
                  >
                    <span>新窗口全屏打开</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <iframe
                  src={previewLink.link}
                  className="w-full flex-1 border-0"
                  title={previewLink.name}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-charcoal-100 dark:text-cream-400">
                <Monitor className="w-12 h-12 text-terracotta/40 mb-3" />
                <p className="font-serif text-sm">点击左侧任意链接，在此处开启实时内嵌画中画预览</p>
                <span className="text-xs font-mono opacity-60 mt-1">(部分由于安全策略禁止 iframe 嵌入的网站可点击新窗口打开)</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
