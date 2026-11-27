import React, { useState, useMemo, useEffect } from 'react';
import { Search, ExternalLink, Copy, Check, LayoutGrid, List, Monitor, Plus, X, Pencil } from 'lucide-react';
import linksData from '@/data/links.json';

export interface LinkItem {
  name: string;
  link: string;
  avatar: string;
  descr: string;
  category?: string;
  sortOrder?: number;
  createdAt?: number;
  _baseKey?: string;
  _isCustom?: boolean;
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
  const [editedMap, setEditedMap] = useState<Record<string, Partial<LinkItem>>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<LinkItem | null>(null);
  const [newLink, setNewLink] = useState<LinkItem>({ name: '', link: '', avatar: '', descr: '', category: '友情链接', sortOrder: 0 });

  useEffect(() => {
    setIsAdmin(localStorage.getItem('admin_authenticated') === 'true');
    const savedCustom = localStorage.getItem('custom_links');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed)) setCustomLinks(parsed);
      } catch {}
    }
    const savedEdits = localStorage.getItem('edited_links_map');
    if (savedEdits) {
      try {
        const parsed = JSON.parse(savedEdits);
        if (parsed && typeof parsed === 'object') setEditedMap(parsed);
      } catch {}
    }
  }, []);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.name.trim() || !newLink.link.trim()) return;
    const itemToAdd: LinkItem = {
      ...newLink,
      sortOrder: newLink.sortOrder !== undefined ? Number(newLink.sortOrder) : 0,
      createdAt: Date.now(),
    };
    // Newly added links default to bottom (sortOrder: 0 < base sortOrder: 1)
    const updated = [...customLinks, itemToAdd];
    setCustomLinks(updated);
    localStorage.setItem('custom_links', JSON.stringify(updated));
    setNewLink({ name: '', link: '', avatar: '', descr: '', category: '友情链接', sortOrder: 0 });
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (editingItem._isCustom && editingItem._baseKey) {
      const idx = Number(editingItem._baseKey);
      const updated = customLinks.map((c, i) =>
        i === idx
          ? {
              ...c,
              name: editingItem.name,
              link: editingItem.link,
              avatar: editingItem.avatar,
              descr: editingItem.descr,
              category: editingItem.category,
              sortOrder: Number(editingItem.sortOrder ?? 0),
            }
          : c
      );
      setCustomLinks(updated);
      localStorage.setItem('custom_links', JSON.stringify(updated));
    } else if (editingItem._baseKey) {
      const nextMap = {
        ...editedMap,
        [editingItem._baseKey]: {
          name: editingItem.name,
          link: editingItem.link,
          avatar: editingItem.avatar,
          descr: editingItem.descr,
          sortOrder: Number(editingItem.sortOrder ?? 1),
        },
      };
      setEditedMap(nextMap);
      localStorage.setItem('edited_links_map', JSON.stringify(nextMap));
    }
    setEditingItem(null);
  };

  const allLinks = useMemo(() => {
    const base = (linksData as CategoryGroup[]).flatMap((c) =>
      c.links.map((l, idx) => {
        const baseKey = `${c.name}::${l.name}::${l.link}`;
        const override = editedMap[baseKey] || {};
        return {
          ...l,
          ...override,
          category: c.name,
          sortOrder: override.sortOrder !== undefined ? Number(override.sortOrder) : 1,
          createdAt: -idx,
          _baseKey: baseKey,
          _isCustom: false,
        };
      })
    );
    const custom = customLinks.map((c, idx) => ({
      ...c,
      sortOrder: c.sortOrder !== undefined ? Number(c.sortOrder) : 0,
      _baseKey: String(idx),
      _isCustom: true,
    }));
    return [...base, ...custom].sort((a, b) => {
      const orderDiff = (b.sortOrder ?? 1) - (a.sortOrder ?? 1);
      if (orderDiff !== 0) return orderDiff;
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    });
  }, [customLinks, editedMap]);

  const categories = useMemo(() => {
    const baseCats = (linksData as CategoryGroup[]).map((c) => c.name);
    const extraCats = customLinks.map((c) => c.category || '自定义').filter((c) => !baseCats.includes(c));
    return ['全部', ...extraCats, ...baseCats];
  }, [customLinks]);

  const defaultPreview = useMemo(
    () => allLinks.find((l) => l.name.includes('磊大大')) || allLinks[0] || null,
    [allLinks]
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('友情链接');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
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
    <div className="space-y-4">
      {/* Centered Top Toolbar */}
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
        <div className="w-full flex flex-wrap items-center justify-center gap-3">
          <h1 className="text-base sm:text-lg font-bold text-charcoal-DEFAULT dark:text-cream-50 shrink-0">
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

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono hover:bg-emerald-500/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> 新增友链
            </button>
          )}
        </div>

      </div>

      {/* Full-Width Single-Line Category Pills: Left-aligned (never clipped), Mouse-Wheel Horizontal Scroll */}
      <div
        onWheel={(e) => {
          if (Math.abs(e.deltaY) > 0) {
            e.preventDefault();
            e.currentTarget.scrollLeft += e.deltaY;
          }
        }}
        className="w-full flex items-center justify-start flex-nowrap overflow-x-auto scrollbar-none gap-2 px-1 sm:px-3 py-1"
        title="鼠标滚轮在此区域可左右滑动切换分类"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
              selectedCategory === cat
                ? 'bg-terracotta text-white border-terracotta shadow-sm'
                : 'border-charcoal-500/15 dark:border-white/10 text-charcoal-200 dark:text-cream-300 hover:border-terracotta/40 hover:text-terracotta'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {layoutMode === 'split' ? (
        /* Split PiP occupies full screen width (83%+ iframe) */
        <div style={{ height: 'var(--pip-height, 82vh)' }} className="flex flex-col lg:flex-row gap-3 min-h-[580px]">
          <div className="w-full lg:w-56 max-h-44 lg:max-h-full flex-shrink-0 overflow-y-auto space-y-1.5 pr-1.5 lg:border-r border-charcoal-500/10 dark:border-white/8">
            {filteredLinks.map((item, idx) => {
              const isSelected = previewLink?.name === item.name && previewLink?.link === item.link;
              return (
                <button
                  key={`split-${item.category}-${item.name}-${idx}`}
                  onClick={(e) => handleItemClick(e, item)}
                  className={`relative overflow-hidden w-full flex items-center gap-2.5 px-3.5 py-2 rounded-full text-left transition-all ${
                    isSelected
                      ? 'water-capsule-active bg-terracotta/15 border border-terracotta/35 shadow-sm'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="water-droplet-bead pointer-events-none absolute top-0 left-1/2 w-3 h-3 rounded-full bg-terracotta/45 blur-[0.5px]"
                    />
                  )}
                  <img
                    src={resolveAvatar(item.avatar, item.link)}
                    alt={item.name}
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0 bg-cream-200 dark:bg-zinc-800 relative z-10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR_SVG;
                    }}
                  />
                  <div className="min-w-0 flex-1 relative z-10">
                    <div className={`text-xs font-medium truncate ${isSelected ? 'text-terracotta font-semibold' : 'text-charcoal-DEFAULT dark:text-cream-50'}`}>{item.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

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
                    {isAdmin && (
                      <button
                        onClick={() => setEditingItem(previewLink)}
                        className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-terracotta transition-colors"
                        title="管理员编辑此友链"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
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
        /* Compact list constrained to max-w-4xl centered */
        <div className="max-w-4xl mx-auto space-y-1 py-2">
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
                <span className="font-medium text-sm text-charcoal-DEFAULT dark:text-cream-50 w-36 flex-shrink-0 truncate">{item.name}</span>
                <span className="text-xs text-charcoal-100 dark:text-cream-400 truncate flex-1">{item.descr}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditingItem(item);
                    }}
                    className="p-1.5 rounded-lg hover:bg-terracotta/10 text-terracotta transition-colors"
                    title="编辑友链"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
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
        /* Card grid constrained to max-w-6xl centered */
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-2">
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
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditingItem(item);
                    }}
                    className="p-1 rounded-lg hover:bg-terracotta/10 text-terracotta"
                    title="编辑友链"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={(e) => handleCopy(e, item.link)}
                  className="p-1 rounded-lg hover:bg-terracotta/10 text-charcoal-100 dark:text-cream-400 hover:text-terracotta"
                >
                  {copiedUrl === item.link ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Inline Admin Add Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <form onSubmit={handleAddLink} className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">🔖 新增友链 / 导航站点</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><X className="w-4 h-4" /></button>
            </div>
            <input type="text" placeholder="站点名称 *" required value={newLink.name} onChange={e => setNewLink({ ...newLink, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm" />
            <input type="url" placeholder="网址 https://... *" required value={newLink.link} onChange={e => setNewLink({ ...newLink, link: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm" />
            <input type="text" placeholder="分类 (如：友情链接、AI工具)" value={newLink.category} onChange={e => setNewLink({ ...newLink, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm" />
            <input type="text" placeholder="简短描述" value={newLink.descr} onChange={e => setNewLink({ ...newLink, descr: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm" />
            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30">
              <label className="text-xs text-charcoal-100 dark:text-cream-300">排序权重（默认 0 排最末，越大越靠前）</label>
              <input type="number" value={newLink.sortOrder ?? 0} onChange={e => setNewLink({ ...newLink, sortOrder: Number(e.target.value) })} className="w-20 px-2 py-1 rounded-lg border border-charcoal-500/15 dark:border-white/15 bg-white dark:bg-zinc-800 text-xs text-center font-mono" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-terracotta text-white text-xs font-mono font-semibold hover:opacity-90">保存并立即添加到导航</button>
          </form>
        </div>
      )}

      {/* Admin Edit Historical/Custom Link Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <form onSubmit={handleSaveEdit} className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-6 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">✏️ 编辑友链</h3>
              <button type="button" onClick={() => setEditingItem(null)} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"><X className="w-4 h-4" /></button>
            </div>
            <input type="text" placeholder="站点名称 *" required value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm" />
            <input type="text" placeholder="网址 https://... *" required value={editingItem.link} onChange={e => setEditingItem({ ...editingItem, link: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm" />
            <input type="text" placeholder="图标 Icon URL" value={editingItem.avatar} onChange={e => setEditingItem({ ...editingItem, avatar: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm" />
            <input type="text" placeholder="描述文案" value={editingItem.descr} onChange={e => setEditingItem({ ...editingItem, descr: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm" />
            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30">
              <label className="text-xs text-charcoal-100 dark:text-cream-300">排序权重（越大越靠前）</label>
              <input type="number" value={editingItem.sortOrder ?? 1} onChange={e => setEditingItem({ ...editingItem, sortOrder: Number(e.target.value) })} className="w-20 px-2 py-1 rounded-lg border border-charcoal-500/15 dark:border-white/15 bg-white dark:bg-zinc-800 text-xs text-center font-mono" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-terracotta text-white text-xs font-mono font-semibold hover:opacity-90">保存修改</button>
          </form>
        </div>
      )}
    </div>
  );
};
