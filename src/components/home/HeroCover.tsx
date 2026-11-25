import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Palette, Sparkles, ArrowDown, RefreshCw, X, Check, Volume2 } from 'lucide-react';

const wallpaperPresets = [
  { name: '低多边形冰淇淋', url: 'https://static.simpledesktops.com/uploads/desktops/2020/11/21/low-poly-ice-cream.png', type: 'image' },
  { name: '雨天窗景', url: 'https://static.simpledesktops.com/uploads/desktops/2014/04/24/rainyDay_2880x1800.png', type: 'image' },
  { name: '幽深暗鹿', url: 'https://static.simpledesktops.com/uploads/desktops/2014/03/05/dark_deer.png', type: 'image' },
  { name: '群山连绵', url: 'https://static.simpledesktops.com/uploads/desktops/2012/06/12/Mountain.png', type: 'image' },
  { name: '钢铁之心', url: 'https://static.simpledesktops.com/uploads/desktops/2012/10/14/Iron_Man.png', type: 'image' },
  { name: '俄罗斯方块', url: 'https://static.simpledesktops.com/uploads/desktops/2012/01/25/tetris.png', type: 'image' },
  { name: '赛博极客', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1800&auto=format&fit=crop', type: 'image' },
];

const colorPresets = [
  { name: '暖陶土橙', value: '#ee7959', type: 'color' },
  { name: '抹茶森林', value: '#5d8351', type: 'color' },
  { name: '湖水薄荷', value: '#b1d5c8', type: 'color' },
  { name: '燕麦温润', value: '#bfa782', type: 'color' },
  { name: '深邃暗夜', value: '#141413', type: 'color' },
];

const gradientPresets = [
  { name: '暮光樱花', value: 'linear-gradient(135deg, #eecda3, #ef629f)', type: 'gradient' },
  { name: '蜜桃落日', value: 'linear-gradient(135deg, #fce38a, #f38181)', type: 'gradient' },
  { name: '蔚蓝天际', value: 'linear-gradient(135deg, #abdcff, #0396ff)', type: 'gradient' },
  { name: '暖金流光', value: 'linear-gradient(135deg, #fad7a1, #e96d71)', type: 'gradient' },
];

export const HeroCover: React.FC = () => {
  const [currentBg, setCurrentBg] = useState<{ type: string; value: string }>({
    type: 'gradient',
    value: 'linear-gradient(135deg, rgba(217, 119, 87, 0.75), rgba(245, 158, 11, 0.6))',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'color' | 'gradient'>('wallpaper');

  useEffect(() => {
    const saved = localStorage.getItem('blogbg');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.type && parsed.value) {
          setCurrentBg(parsed);
        }
      } catch (e) {
        // Fallback to string if old format
        if (saved.startsWith('http')) {
          setCurrentBg({ type: 'image', value: saved });
        }
      }
    }
  }, []);

  const selectBg = (type: string, value: string) => {
    const next = { type, value };
    setCurrentBg(next);
    localStorage.setItem('blogbg', JSON.stringify(next));
    setIsModalOpen(false);
  };

  const getBackgroundStyle = () => {
    if (currentBg.type === 'image') {
      return {
        backgroundImage: `url(${currentBg.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    } else if (currentBg.type === 'color') {
      return { backgroundColor: currentBg.value };
    } else {
      return { backgroundImage: currentBg.value };
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden mb-12 shadow-2xl transition-all duration-700">
      {/* 1. Large Dynamic Hero Banner Background */}
      <div
        style={getBackgroundStyle()}
        className="w-full min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-6 sm:p-12 relative transition-all duration-700"
      >
        {/* Dark overlay mask to ensure white text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />

        {/* Top bar on banner */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-mono border border-white/25">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Product Manager · Larry's Space</span>
          </div>

          {/* Switch Cover Pill Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-mono border border-white/20 hover:border-white/40 transition-all hover:scale-105"
          >
            <Palette className="w-3.5 h-3.5 text-amber-300" />
            <span>切换封面 (壁纸/纯色)</span>
          </button>
        </div>

        {/* Hero Center Text & Identity */}
        <div className="relative z-10 max-w-2xl py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-terracotta to-amber-500 text-white flex items-center justify-center font-serif font-bold text-2xl shadow-glow-terracotta border-2 border-white/40">
              L
            </div>
            <div>
              <h1 className="text-white font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight drop-shadow-md">
                磊大大 Larry
              </h1>
              <p className="text-white/80 font-mono text-xs sm:text-sm mt-0.5">
                AI 产品经理 · PMOS 创作者 · 全栈探索者
              </p>
            </div>
          </div>

          <p className="text-white/90 font-serif text-base sm:text-lg leading-relaxed mt-4 drop-shadow">
            “专注于陪伴、成长与分享，愿你总能遇到温柔的人！” <br />
            以产品思维定义人机边界，把需求、PRD、可操作原型与 93+ 交互动效融为一体。
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <a
              href="/portfolio"
              className="px-5 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-500 text-white font-medium text-xs sm:text-sm shadow-lg transition-transform hover:scale-105"
            >
              🚀 查看旗舰 PMOS 与作品集
            </a>
            <a
              href="/entertain"
              className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium text-xs sm:text-sm border border-white/30 transition-transform hover:scale-105"
            >
              ✨ 娱乐馆 (音乐/烟花/雨声)
            </a>
            <a
              href="/tools"
              className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium text-xs sm:text-sm border border-white/30 transition-transform hover:scale-105"
            >
              🛠️ 工具与书签库
            </a>
          </div>
        </div>

        {/* Bottom Banner Stats Pill */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20 text-white/80 text-xs font-mono">
          <div className="flex items-center gap-4 sm:gap-6">
            <span>📚 <strong>99+</strong> 篇技术沉淀</span>
            <span>🎨 <strong>93+</strong> 个原生动效</span>
            <span>🔗 <strong>108+</strong> 个精选链接</span>
          </div>
          <span className="text-[11px] opacity-75">
            滚动浏览人机协同内容 ↓
          </span>
        </div>
      </div>

      {/* 2. Switch Cover Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl rounded-3xl glass p-6 border border-white/20 shadow-2xl bg-cream-50 dark:bg-obsidian"
            >
              <div className="flex items-center justify-between pb-4 border-b border-charcoal-500/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-terracotta" />
                  <h3 className="font-serif text-lg font-bold text-charcoal-DEFAULT dark:text-cream-50">
                    自由切换封面风格
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl glass hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 my-4">
                <button
                  onClick={() => setActiveTab('wallpaper')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === 'wallpaper' ? 'bg-terracotta text-white' : 'glass text-charcoal-100 dark:text-cream-300'
                  }`}
                >
                  🖼️ 精选壁纸
                </button>
                <button
                  onClick={() => setActiveTab('gradient')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === 'gradient' ? 'bg-terracotta text-white' : 'glass text-charcoal-100 dark:text-cream-300'
                  }`}
                >
                  🌈 流光渐变
                </button>
                <button
                  onClick={() => setActiveTab('color')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === 'color' ? 'bg-terracotta text-white' : 'glass text-charcoal-100 dark:text-cream-300'
                  }`}
                >
                  🎨 纯色温润
                </button>
              </div>

              {/* Grid content */}
              <div className="max-h-72 overflow-y-auto pr-1">
                {activeTab === 'wallpaper' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {wallpaperPresets.map((wp) => (
                      <div
                        key={wp.name}
                        onClick={() => selectBg('image', wp.url)}
                        className="group relative h-24 rounded-xl overflow-hidden cursor-pointer border border-charcoal-500/10 hover:border-terracotta transition-all"
                      >
                        <img src={wp.url} alt={wp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute bottom-1 left-2 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur">
                          {wp.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'gradient' && (
                  <div className="grid grid-cols-2 gap-3">
                    {gradientPresets.map((gp) => (
                      <div
                        key={gp.name}
                        onClick={() => selectBg('gradient', gp.value)}
                        style={{ backgroundImage: gp.value }}
                        className="h-20 rounded-xl p-3 flex items-end justify-between text-white font-medium text-xs cursor-pointer shadow hover:scale-102 transition-transform"
                      >
                        <span>{gp.name}</span>
                        <Check className="w-4 h-4 opacity-75" />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'color' && (
                  <div className="grid grid-cols-3 gap-3">
                    {colorPresets.map((cp) => (
                      <div
                        key={cp.name}
                        onClick={() => selectBg('color', cp.value)}
                        style={{ backgroundColor: cp.value }}
                        className="h-20 rounded-xl p-3 flex items-end justify-between text-white font-medium text-xs cursor-pointer shadow hover:scale-102 transition-transform"
                      >
                        <span>{cp.name}</span>
                        <span className="text-[10px] font-mono opacity-80">{cp.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
