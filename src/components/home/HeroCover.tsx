import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown, X, Check } from 'lucide-react';

const wallpaperPresets = [
  { name: 'SimpleDark', url: 'https://static.simpledesktops.com/uploads/desktops/2014/03/05/dark_deer.png', type: 'image' },
  { name: 'Mountain', url: 'https://static.simpledesktops.com/uploads/desktops/2012/06/12/Mountain.png', type: 'image' },
  { name: 'Rainy Day', url: 'https://static.simpledesktops.com/uploads/desktops/2014/04/24/rainyDay_2880x1800.png', type: 'image' },
  { name: 'Tetris', url: 'https://static.simpledesktops.com/uploads/desktops/2012/01/25/tetris.png', type: 'image' },
  { name: 'Cyber', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1800&auto=format&fit=crop', type: 'image' },
  { name: 'Nordic', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1800&auto=format&fit=crop', type: 'image' },
  { name: 'Minimal', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1800&auto=format&fit=crop', type: 'image' },
];

const colorPresets = [
  { name: 'Terracotta', value: '#ee7959', type: 'color' },
  { name: 'Forest', value: '#2d4a3e', type: 'color' },
  { name: 'Obsidian', value: '#141413', type: 'color' },
  { name: 'Lapis', value: '#1a2b4a', type: 'color' },
  { name: 'Plum', value: '#2d1b4e', type: 'color' },
];

const gradientPresets = [
  { name: 'Dusk', value: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', type: 'gradient' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #0d1117, #1a4a3a, #0d1117)', type: 'gradient' },
  { name: 'Coral', value: 'linear-gradient(135deg, #1a0a0a, #3d1515, #ee7959)', type: 'gradient' },
  { name: 'Steel', value: 'linear-gradient(135deg, #0d1117, #161b22, #21262d)', type: 'gradient' },
  { name: 'Neon', value: 'linear-gradient(135deg, #0a0a0a, #0d2137, #001f3f)', type: 'gradient' },
];

export const HeroCover: React.FC = () => {
  const [currentBg, setCurrentBg] = useState<{ type: string; value: string }>({
    type: 'gradient',
    value: 'linear-gradient(135deg, #0d1117, #1a1a2e, #16213e)',
  });
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'color' | 'gradient'>('gradient');

  useEffect(() => {
    const saved = localStorage.getItem('blogbg');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.type && parsed.value) setCurrentBg(parsed);
      } catch {
        if (saved.startsWith('http')) setCurrentBg({ type: 'image', value: saved });
      }
    }
  }, []);

  const selectBg = (type: string, value: string) => {
    const next = { type, value };
    setCurrentBg(next);
    localStorage.setItem('blogbg', JSON.stringify(next));
    setIsOpen(false);
  };

  const bgStyle =
    currentBg.type === 'image'
      ? { backgroundImage: `url(${currentBg.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : currentBg.type === 'color'
      ? { backgroundColor: currentBg.value }
      : { backgroundImage: currentBg.value };

  return (
    <div
      style={bgStyle}
      className="relative w-screen -mx-4 sm:-mx-6 left-0 right-0 h-screen max-h-screen flex flex-col items-center justify-center overflow-hidden mb-16 transition-all duration-700"
    >
      {/* Dark vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-10" />

      {/* Animated noise grain for depth */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px' }}
      />

      {/* Center content - minimal & impactful */}
      <div className="relative z-20 text-center space-y-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-white/70 text-xs font-mono backdrop-blur-md bg-white/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Product Manager & Co-creator
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-none tracking-tighter">
            磊大大
          </h1>
          <p className="mt-4 text-white/50 text-sm sm:text-base font-mono tracking-widest uppercase">
            Larry · AI PM · Digital Garden
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3 pt-4"
        >
          <a
            href="/portfolio"
            className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all shadow-2xl"
          >
            查看作品集
          </a>
          <a
            href="/about"
            className="px-6 py-2.5 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 backdrop-blur-md transition-all"
          >
            关于我
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40 text-xs font-mono"
      >
        <span>scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>

      {/* Cover Switcher Button - bottom right */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-10 right-6 z-30 flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 hover:border-white/30 text-white/70 hover:text-white text-xs font-mono transition-all"
        title="切换封面"
      >
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">切换封面</span>
      </button>

      {/* Switcher Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-sm rounded-3xl bg-zinc-900/95 border border-white/10 backdrop-blur-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-white text-sm">切换封面背景</span>
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-xl bg-white/5 mb-4">
                {(['gradient', 'wallpaper', 'color'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab ? 'bg-white text-black' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {tab === 'gradient' ? '渐变' : tab === 'wallpaper' ? '壁纸' : '纯色'}
                  </button>
                ))}
              </div>

              {/* Gradient swatches */}
              {activeTab === 'gradient' && (
                <div className="grid grid-cols-3 gap-2">
                  {gradientPresets.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => selectBg(p.type, p.value)}
                      className="relative h-16 rounded-xl overflow-hidden border-2 border-transparent hover:border-white/50 transition-all"
                      style={{ backgroundImage: p.value }}
                      title={p.name}
                    >
                      {currentBg.value === p.value && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-white/70 font-mono">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Wallpaper swatches */}
              {activeTab === 'wallpaper' && (
                <div className="grid grid-cols-3 gap-2">
                  {wallpaperPresets.map((p) => (
                    <button
                      key={p.url}
                      onClick={() => selectBg(p.type, p.url)}
                      className="relative h-16 rounded-xl overflow-hidden border-2 border-transparent hover:border-white/50 transition-all"
                      style={{ backgroundImage: `url(${p.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      title={p.name}
                    >
                      {currentBg.value === p.url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Color swatches */}
              {activeTab === 'color' && (
                <div className="flex gap-3 flex-wrap">
                  {colorPresets.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => selectBg(p.type, p.value)}
                      className="w-14 h-14 rounded-2xl border-2 border-transparent hover:border-white/60 transition-all relative shadow-lg"
                      style={{ backgroundColor: p.value }}
                      title={p.name}
                    >
                      {currentBg.value === p.value && (
                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
