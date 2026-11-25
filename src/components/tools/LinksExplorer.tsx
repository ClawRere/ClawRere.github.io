import React, { useState, useMemo, useEffect } from 'react';
import { Search, ExternalLink, Copy, Check, LayoutGrid, List, Monitor } from 'lucide-react';
import linksData from '@/data/links.json';

export interface LinkItem {
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
  } catch {}
  return DEFAULT_AVATAR_SVG;
}

export const LinksExplorer: React.FC = () => {
  const [customLinks, setCustomLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    const savedCustom = localStorage.getItem('custom_links');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed)) setCustomLinks(parsed);
      } catch {}
    }
  }, []);

  const allLinks = useMemo(() => {
    const base = (linksData as CategoryGroup[]).flatMap((c) => c.links.map((l) => ({ ...l, category: c.name })));
    return [...customLinks, ...base];
  }, [customLinks]);

  const categories = useMemo(() => {
    const baseCats = (linksData as CategoryGroup[]).map((c) => c.name);
    const extraCats = customLinks.map((c) => c.category || '自定义').filter((c) => !baseCats.includes(c));
    return ['全部', ...extraCats, ...baseCats];
  }, [customLinks]);

  const defaultPreview = useMemo(
    () => allLinks.find((l) => l.name.includes('磊大大')) || allLinks[0] || null,
    [allLinks]
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('card');
  const [previewLink, setPreviewLink] = useState<LinkItem | null>(defaultPreview);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

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

  const getSafeIframeSrc = (link: string) => (link === '/' ? '/about' : link);

  return (
    <div className="space-y-3">
      {/* Ultra-compact Single Top Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <h1 className="text-base sm:text-lg font-bold text-charcoal-DEFAULT dark:text-cream-50 shrink-0 mr-1">
          🔖 友链导航 <span className="text-xs font-mono text-terracotta font-normal">({filteredLinks.length})</span>
        </h1>

        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-100 dark:text-cream-400" />
          <input
            type="text"
            placeholder="搜索站点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 text-xs text-charcoal-DEFAULT dark:text-cream-100 focus:outline-none focus:border-terracotta/50"
          />
        </div>

        {/* Layout mode switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg border border-charcoal-500/10 dark:border-white/10 bg-white/40 dark:bg-black/20">
          {([
            ['card', '卡片', LayoutGrid],
            ['compact', '列表', List],
            ['split', '画中画', Monitor],
          ] as const).map(([mode, label, Icon]) => (
            <button
              key={mode}
              onClick={() => switchLayout(mode)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                layoutMode === mode
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'text-charcoal-100 dark:text-cream-400 hover:text-charcoal dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Inline scrollable category pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 w-full scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
                selectedCategory === cat
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'border-charcoal-500/15 dark:border-white/10 text-charcoal-200 dark:text-cream-300 hover:border-terracotta/40 hover:text-terracotta'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {layoutMode === 'split' ? (
        /* Split PiP occupies 82%+ width and full viewport height */
        <div className="flex flex-col lg:flex-row gap-3 h-[calc(100vh-10.5rem)] min-h-[600px]">
          {/* Narrow Left Sidebar ~17% */}
          <div className="w-full lg:w-56 max-h-44 lg:max-h-full flex-shrink-0 overflow-y-auto space-y-1 pr-1 lg:border-r border-charcoal-500/10 dark:border-white/8">
            {filteredLinks.map((item, idx) => (
              <button
                key={`split-${item.category}-${item.name}-${idx}`}
                onClick={(e) => handleItemClick(e, item)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-all ${
                  previewLink?.name === item.name && previewLink?.link === item.link
                    ? 'bg-terracotta/15 border border-terracotta/30'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <img
                  src={resolveAvatar(item.avatar, item.link)}
                  alt={item.name}
                  className="w-6 h-6 rounded-md object-cover flex-shrink-0 bg-cream-200 dark:bg-zinc-800"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR_SVG;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-charcoal-DEFAULT dark:text-cream-50 truncate">{item.name}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Wide Right PiP Preview ~83% */}
          <div className="flex-1 min-w-0 h-full">
            {previewLink && (
              <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-charcoal-500/10 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2 bg-cream-100/80 dark:bg-zinc-900/80 border-b border-charcoal-500/8 dark:border-white/8 shrink-0">
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
                      className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-charcoal-100 dark:text-cream-400 hover:text-terracotta transition-colors"
                    >
                      {copiedUrl === previewLink.link ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={previewLink.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-charcoal-100 dark:text-cream-400 hover:text-terracotta transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <iframe
                  key={`${previewLink.name}-${previewLink.link}`}
                  src={getSafeIframeSrc(previewLink.link)}
                  title={previewLink.name}
                  className="flex-1 w-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            )}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          {filteredLinks.map((item, idx) => (
            <a
              key={`card-${item.category}-${item.name}-${idx}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 rounded-2xl border border-charcoal-500/10 dark:border-white/8 hover:border-terracotta/30 dark:hover:border-terracotta/30 hover:shadow-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all duration-200 flex flex-col items-center text-center gap-2.5"
            >
              <img
                src={resolveAvatar(item.avatar, item.link)}
                alt={item.name}
                className="w-11 h-11 rounded-xl object-cover bg-cream-200 dark:bg-zinc-800 group-hover:scale-105 transition-transform"
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
