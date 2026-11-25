import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Copy, Check, LayoutGrid, List, Monitor, X } from 'lucide-react';
import linksData from '@/data/links.json';

interface LinkItem {
  name: string;
  link: string;
  avatar: string;
  descr: string;
  category?: string;
}

interface CategoryGroup {
  name: string;
  desc: string;
  links: LinkItem[];
}

type LayoutMode = 'card' | 'compact' | 'split';

const DEFAULT_AVATAR_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#D97757"/><stop offset="100%" stop-color="#F59E0B"/></linearGradient></defs><rect width="80" height="80" rx="18" fill="url(#g)"/><circle cx="40" cy="34" r="14" fill="rgba(255,255,255,0.28)"/><path d="M22 60c4-10 32-10 36 0" stroke="rgba(255,255,255,0.75)" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`
  );

function resolveAvatar(avatar: string, link: string): string {
  if (avatar && !avatar.startsWith('/img/')) {
    return avatar;
  }
  try {
    if (link && link.startsWith('http')) {
      const host = new URL(link).hostname;
      return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
    }
  } catch {
    // ignore invalid URL
  }
  return DEFAULT_AVATAR_SVG;
}

export const LinksExplorer: React.FC = () => {
  const categories = useMemo(() => ['全部', ...(linksData as CategoryGroup[]).map((c) => c.name)], []);
  const allLinks = useMemo(
    () => (linksData as CategoryGroup[]).flatMap((c) => c.links.map((l) => ({ ...l, category: c.name }))),
    []
  );

  // Default PiP link is "磊大大" (or first item)
  const defaultPreview = useMemo(
    () => allLinks.find((l) => l.name.includes('磊大大')) || allLinks[0] || null,
    [allLinks]
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('card');
  const [previewLink, setPreviewLink] = useState<LinkItem | null>(defaultPreview);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('links_layout') as LayoutMode | null;
    if (saved) {
      setLayoutMode(saved);
      if (saved === 'split' && !previewLink) setPreviewLink(defaultPreview);
    }
  }, [defaultPreview]);

  const switchLayout = (mode: LayoutMode) => {
    setLayoutMode(mode);
    localStorage.setItem('links_layout', mode);
    if (mode === 'split' && !previewLink) {
      setPreviewLink(defaultPreview);
    }
  };

  const filteredLinks = useMemo(() => {
    return allLinks.filter((item) => {
      const matchCat = selectedCategory === '全部' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQ =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.descr.toLowerCase().includes(q) ||
        item.link.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [allLinks, selectedCategory, searchQuery]);

  const handleCopy = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    e.preventDefault();
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

  // Prevent infinite self-iframe recursion if link is "/"
  const getSafeIframeSrc = (link: string) => (link === '/' ? '/about' : link);

  return (
    <div className="space-y-5">
      {/* Brief intro banner - auto-dismiss */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.45 }}
            className="overflow-hidden"
          >
            <div className="relative p-4 rounded-2xl bg-terracotta/8 border border-terracotta/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔖</span>
                <div>
                  <span className="font-semibold text-sm text-charcoal-DEFAULT dark:text-cream-50">
                    {allLinks.length} 个精选站点 · {categories.length - 1} 个分类
                  </span>
                  <p className="text-xs text-charcoal-100 dark:text-cream-400 mt-0.5">
                    支持卡片、列表、画中画三种浏览方式
                  </p>
                </div>
              </div>
              <button onClick={() => setShowIntro(false)} className="text-charcoal-100 dark:text-cream-400 hover:text-terracotta p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Layout switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-100 dark:text-cream-400" />
          <input
            type="text"
            placeholder="搜索站点名、描述或链接..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 text-sm text-charcoal-DEFAULT dark:text-cream-100 placeholder-charcoal-100 dark:placeholder-cream-400 backdrop-blur-sm focus:outline-none focus:border-terracotta/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl border border-charcoal-500/10 dark:border-white/10 bg-white/40 dark:bg-black/20">
          {([
            ['card', '卡片', LayoutGrid],
            ['compact', '列表', List],
            ['split', '画中画', Monitor],
          ] as const).map(([mode, label, Icon]) => (
            <button
              key={mode}
              onClick={() => switchLayout(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                layoutMode === mode
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'text-charcoal-100 dark:text-cream-400 hover:text-charcoal dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const count = cat === '全部' ? allLinks.length : (linksData as CategoryGroup[]).find((c) => c.name === cat)?.links.length ?? 0;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                selectedCategory === cat
                  ? 'bg-terracotta text-white border-terracotta shadow-sm'
                  : 'border-charcoal-500/15 dark:border-white/10 text-charcoal-200 dark:text-cream-300 hover:border-terracotta/40 hover:text-terracotta'
              }`}
            >
              {cat} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="text-xs font-mono text-charcoal-100 dark:text-cream-400">
        找到 <span className="text-terracotta font-semibold">{filteredLinks.length}</span> 个站点
        {searchQuery && <span> · 匹配 "{searchQuery}"</span>}
      </p>

      {/* Content */}
      {layoutMode === 'split' ? (
        <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: '72vh' }}>
          {/* Left list - 28% */}
          <div className="w-full lg:w-[28%] max-h-60 lg:max-h-[72vh] flex-shrink-0 overflow-y-auto space-y-1 pr-1 lg:border-r border-charcoal-500/10 dark:border-white/8">
            {filteredLinks.map((item, idx) => (
              <button
                key={`split-${item.category}-${item.name}-${idx}`}
                onClick={(e) => handleItemClick(e, item)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  previewLink?.name === item.name && previewLink?.link === item.link
                    ? 'bg-terracotta/10 border border-terracotta/30'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <img
                  src={resolveAvatar(item.avatar, item.link)}
                  alt={item.name}
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0 bg-cream-200 dark:bg-zinc-800"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR_SVG;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-charcoal-DEFAULT dark:text-cream-50 truncate">{item.name}</div>
                  <div className="text-xs text-charcoal-100 dark:text-cream-400 truncate">{item.descr}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Right iframe preview - 72% */}
          <div className="flex-1 min-w-0 min-h-[520px]">
            {previewLink ? (
              <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-charcoal-500/10 dark:border-white/10 bg-white dark:bg-zinc-950">
                <div className="flex items-center justify-between px-4 py-2.5 bg-cream-100/80 dark:bg-zinc-900/80 border-b border-charcoal-500/8 dark:border-white/8">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                    </div>
                    <span className="text-xs font-mono text-charcoal-100 dark:text-cream-400 ml-1 truncate">
                      {previewLink.name} · {previewLink.link}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleCopy(e, previewLink.link)}
                      className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-charcoal-100 dark:text-cream-400 hover:text-terracotta transition-colors"
                    >
                      {copiedUrl === previewLink.link ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={previewLink.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-charcoal-100 dark:text-cream-400 hover:text-terracotta transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <iframe
                  key={`${previewLink.name}-${previewLink.link}`}
                  src={getSafeIframeSrc(previewLink.link)}
                  title={previewLink.name}
                  className="flex-1 w-full border-0 min-h-[480px]"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : layoutMode === 'compact' ? (
        <div className="space-y-1">
          {filteredLinks.map((item, idx) => (
            <a
              key={`compact-${item.category}-${item.name}-${idx}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-3 rounded-xl hover:bg-black/4 dark:hover:bg-white/4 border border-transparent hover:border-charcoal-500/10 dark:hover:border-white/8 transition-all"
            >
              <img
                src={resolveAvatar(item.avatar, item.link)}
                alt={item.name}
                className="w-7 h-7 rounded-lg object-cover flex-shrink-0 bg-cream-200 dark:bg-zinc-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_AVATAR_SVG;
                }}
              />
              <div className="flex-1 min-w-0 flex items-center gap-4">
                <span className="font-medium text-sm text-charcoal-DEFAULT dark:text-cream-50 w-32 flex-shrink-0 truncate">{item.name}</span>
                <span className="text-xs text-charcoal-100 dark:text-cream-400 truncate flex-1">{item.descr}</span>
                <span className="text-[10px] font-mono text-charcoal-100/50 dark:text-cream-400/50 hidden lg:block truncate max-w-[180px]">{item.link}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleCopy(e, item.link)}
                  className="p-1.5 rounded-lg hover:bg-terracotta/10 text-charcoal-100 dark:text-cream-400 hover:text-terracotta transition-colors"
                >
                  {copiedUrl === item.link ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <ExternalLink className="w-3.5 h-3.5 text-charcoal-100 dark:text-cream-400 group-hover:text-terracotta transition-colors" />
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredLinks.map((item, idx) => (
            <a
              key={`card-${item.category}-${item.name}-${idx}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 rounded-2xl border border-charcoal-500/10 dark:border-white/8 hover:border-terracotta/30 dark:hover:border-terracotta/30 hover:shadow-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all duration-200 flex flex-col items-center text-center gap-3"
            >
              <img
                src={resolveAvatar(item.avatar, item.link)}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover bg-cream-200 dark:bg-zinc-800 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_AVATAR_SVG;
                }}
              />
              <div className="w-full">
                <div className="font-semibold text-sm text-charcoal-DEFAULT dark:text-cream-50 truncate group-hover:text-terracotta transition-colors">{item.name}</div>
                <div className="text-xs text-charcoal-100 dark:text-cream-400 line-clamp-2 mt-0.5 leading-relaxed">{item.descr}</div>
              </div>
              <button
                onClick={(e) => handleCopy(e, item.link)}
                className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-terracotta/10 text-charcoal-100 dark:text-cream-400 hover:text-terracotta transition-all"
              >
                {copiedUrl === item.link ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
