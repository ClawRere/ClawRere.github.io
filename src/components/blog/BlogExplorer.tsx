import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, ArrowUpRight, Sparkles, User, Tag, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getPostCover } from '@/lib/covers';

interface PostItem {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  categories?: string | string[] | null;
  tags?: string | string[] | null;
  cover?: string | null;
}

interface BlogExplorerProps {
  posts: PostItem[];
  categories: string[];
}

const POSTS_PER_PAGE = 9;

export const BlogExplorer: React.FC<BlogExplorerProps> = ({ posts, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCat =
        selectedCategory === '全部' ||
        (Array.isArray(post.categories)
          ? post.categories.includes(selectedCategory)
          : post.categories === selectedCategory);

      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        (post.description && post.description.toLowerCase().includes(query));

      return matchCat && matchQuery;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* 1. Personal Author & Garden Bio Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 relative overflow-hidden bg-gradient-to-br from-cream-100/60 via-cream-50/40 to-terracotta-50/30 dark:from-obsidian-card dark:via-obsidian dark:to-obsidian-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-terracotta to-amber-500 flex items-center justify-center text-white font-serif font-bold text-2xl shadow-glow-terracotta">
                L
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-obsidian animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-DEFAULT dark:text-cream-50">
                  磊大大的数字花园
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20">
                  Tech Blog
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-charcoal-100 dark:text-cream-300">
                专注于陪伴、成长与技术分享，愿你总能遇到温柔的人！
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-center px-3 py-1.5 rounded-xl bg-white/60 dark:bg-black/20 border border-charcoal-500/5 dark:border-white/5">
              <span className="block text-lg font-bold text-terracotta font-serif">{posts.length}</span>
              <span className="text-[10px] text-charcoal-100 dark:text-cream-400">文章沉淀</span>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl bg-white/60 dark:bg-black/20 border border-charcoal-500/5 dark:border-white/5">
              <span className="block text-lg font-bold text-amber-500 font-serif">93</span>
              <span className="text-[10px] text-charcoal-100 dark:text-cream-400">交互特效</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-100 dark:text-cream-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="搜索文章标题或关键词..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl glass text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-50 placeholder:text-charcoal-100/60 dark:placeholder:text-cream-400/60 focus:outline-none focus:border-terracotta/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-100 dark:text-cream-400 hover:text-charcoal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Total found info */}
        <span className="text-xs font-mono text-charcoal-100 dark:text-cream-400 self-center">
          找到 <strong className="text-terracotta">{filteredPosts.length}</strong> 篇文章
        </span>
      </div>

      {/* Category Pills Bar */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-charcoal-500/10 dark:border-white/10">
        <button
          onClick={() => handleCategoryChange('全部')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedCategory === '全部'
              ? 'bg-terracotta text-white shadow-glow-terracotta'
              : 'glass text-charcoal-200 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-obsidian-hover'
          }`}
        >
          全部 ({posts.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
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

      {/* 3. Visual Card Grid (No more text dump!) */}
      {paginatedPosts.length === 0 ? (
        <div className="text-center py-16 text-charcoal-100 dark:text-cream-400 font-mono text-sm">
          未检索到相关文章，尝试更换关键词。
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {paginatedPosts.map((post, idx) => {
              const coverImg = getPostCover(post.cover, post.title, idx);
              const categoryName = Array.isArray(post.categories)
                ? post.categories[0]
                : post.categories || '技术笔记';

              return (
                <motion.a
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  href={`/posts/${post.id}`}
                  className="group flex flex-col rounded-2xl glass overflow-hidden border border-charcoal-500/10 dark:border-white/10 hover:border-terracotta/40 dark:hover:border-terracotta/40 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Visual Card Cover Image with zoom on hover */}
                  <div className="h-44 w-full relative overflow-hidden bg-cream-200 dark:bg-obsidian-card">
                    <img
                      src={coverImg}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Category Pill on Cover */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[11px] font-mono font-medium text-charcoal-DEFAULT dark:text-cream-100 shadow-sm">
                      {categoryName}
                    </span>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-charcoal-100 dark:text-cream-400 mb-2">
                        <Calendar className="w-3 h-3 text-terracotta" />
                        <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                      </div>

                      <h2 className="font-serif text-lg font-medium text-charcoal-DEFAULT dark:text-cream-50 group-hover:text-terracotta transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h2>

                      {post.description && (
                        <p className="mt-2 text-xs text-charcoal-100 dark:text-cream-300 line-clamp-2 leading-relaxed">
                          {post.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-charcoal-500/10 dark:border-white/10 flex items-center justify-between text-xs font-mono text-terracotta">
                      <span>阅读全文</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 4. Elegant Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-charcoal-500/10 dark:border-white/10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl glass disabled:opacity-30 disabled:pointer-events-none text-charcoal-DEFAULT dark:text-cream-100 hover:bg-cream-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-charcoal-100 dark:text-cream-400">
            第 <strong className="text-terracotta">{currentPage}</strong> / {totalPages} 页
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl glass disabled:opacity-30 disabled:pointer-events-none text-charcoal-DEFAULT dark:text-cream-100 hover:bg-cream-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
