import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown, X, Check } from 'lucide-react';

const wallpaperPresets = [
  { name: '极光雪山', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop', type: 'image' },
  { name: '赛博流光', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop', type: 'image' },
  { name: '星海深空', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop', type: 'image' },
  { name: '落日海岸', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop', type: 'image' },
  { name: '京都暮色', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop', type: 'image' },
  { name: '几何极简', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2000&auto=format&fit=crop', type: 'image' },
  { name: '低多边形冰淇淋', url: 'https://static.simpledesktops.com/uploads/desktops/2020/11/21/low-poly-ice-cream.png', type: 'image' },
  { name: '雨天窗景', url: 'https://static.simpledesktops.com/uploads/desktops/2014/04/24/rainyDay_2880x1800.png', type: 'image' },
  { name: '幽深暗鹿', url: 'https://static.simpledesktops.com/uploads/desktops/2014/03/05/dark_deer.png', type: 'image' },
  { name: '群山连绵', url: 'https://static.simpledesktops.com/uploads/desktops/2012/06/12/Mountain.png', type: 'image' },
  { name: '钢铁之心', url: 'https://static.simpledesktops.com/uploads/desktops/2012/10/14/Iron_Man.png', type: 'image' },
  { name: '俄罗斯方块', url: 'https://static.simpledesktops.com/uploads/desktops/2012/01/25/tetris.png', type: 'image' },
];

const colorPresets = [
  { name: '暖陶土橙', value: '#ee7959', type: 'color' },
  { name: '抹茶森林', value: '#2d4a3e', type: 'color' },
  { name: '深邃暗夜', value: '#141413', type: 'color' },
  { name: '青金石蓝', value: '#1a2b4a', type: 'color' },
  { name: '暗夜紫罗兰', value: '#2d1b4e', type: 'color' },
  { name: '燕麦温润', value: '#bfa782', type: 'color' },
];

const gradientPresets = [
  { name: '暮光樱花', value: 'linear-gradient(135deg, #eecda3, #ef629f)', type: 'gradient' },
  { name: '极光深空', value: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', type: 'gradient' },
  { name: '蔚蓝天际', value: 'linear-gradient(135deg, #4facfe, #00f2fe)', type: 'gradient' },
  { name: '蜜桃落日', value: 'linear-gradient(135deg, #ff758c, #ff7eb3)', type: 'gradient' },
  { name: '紫霞幻境', value: 'linear-gradient(135deg, #667eea, #764ba2)', type: 'gradient' },
  { name: '暖金流光', value: 'linear-gradient(135deg, #f6d365, #fda085)', type: 'gradient' },
];

const defaultPhrases = [
  '用 AI 重新定义产品边界 · Co-creating with Intelligence',
  '5W1H 穿透本质 · 假设与事实分层决策',
  'Apple 流体动效 × Claude 人文温润质感',
  '欢迎来到磊大大的数字花园 · Digital Garden',
];

export const HeroCover: React.FC = () => {
  const [currentBg, setCurrentBg] = useState<{ type: string; value: string }>({
    type: 'image',
    value: wallpaperPresets[0].url,
  });
  const [phrases, setPhrases] = useState<string[]>(defaultPhrases);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'color' | 'gradient'>('wallpaper');

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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
    const savedPhrases = localStorage.getItem('hero_phrases');
    if (savedPhrases) {
      try {
        const arr = JSON.parse(savedPhrases);
        if (Array.isArray(arr) && arr.length > 0) setPhrases(arr);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex % phrases.length] || defaultPhrases[0];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < currentPhrase.length) {
      timeout = setTimeout(() => setCharIndex(charIndex + 1), 65);
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(charIndex - 1), 32);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((phraseIndex + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, phrases]);

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

  const activePhrase = phrases[phraseIndex % phrases.length] || defaultPhrases[0];

  return (
    <div
      style={bgStyle}
      className="relative w-full h-[calc(100vh-3.5rem)] min-h-[540px] flex flex-col items-center justify-center overflow-hidden mb-14 transition-all duration-700"
    >
      {/* Pure crisp image - NO grey/black overlay */}

      {/* Center Minimal Title + Typewriter */}
      <div className="relative z-20 text-center px-6 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)] select-none"
        >
          磊大大
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-black/25 backdrop-blur-md border border-white/20 shadow-xl"
        >
          <span className="text-sm sm:text-base md:text-lg font-mono text-white tracking-wide drop-shadow-sm">
            {activePhrase.slice(0, charIndex)}
          </span>
          <span className="inline-block w-[2px] h-5 bg-terracotta ml-1 animate-pulse" />
        </motion.div>
      </div>

      {/* Scroll Down Arrow */}
      <motion.a
        href="#hub-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 p-2 rounded-full text-white/85 hover:text-white drop-shadow transition-colors"
        aria-label="向下滚动"
      >
        <ChevronDown className="w-7 h-7 animate-bounce" />
      </motion.a>

      {/* Subtle Cover Switcher Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-8 right-6 z-30 p-3 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-md border border-white/25 text-white transition-all shadow-lg hover:scale-105"
        title="切换封面壁纸 / 纯色 / 渐变"
      >
        <Palette className="w-4 h-4" />
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full max-w-md rounded-3xl bg-zinc-900/95 border border-white/10 backdrop-blur-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-white text-sm">切换封面背景 ({wallpaperPresets.length} 张壁纸)</span>
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-1 p-1 rounded-xl bg-white/5 mb-4">
                {(['wallpaper', 'gradient', 'color'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {tab === 'wallpaper' ? '高清壁纸' : tab === 'gradient' ? '流光渐变' : '极简纯色'}
                  </button>
                ))}
              </div>

              {activeTab === 'wallpaper' && (
                <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                  {wallpaperPresets.map((p) => (
                    <button
                      key={p.url}
                      onClick={() => selectBg(p.type, p.url)}
                      className="relative h-20 rounded-xl overflow-hidden border-2 border-transparent hover:border-white/60 transition-all group"
                      style={{ backgroundImage: `url(${p.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      title={p.name}
                    >
                      {currentBg.value === p.url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-black/55 py-0.5 text-[10px] text-white/90 truncate px-1">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'gradient' && (
                <div className="grid grid-cols-3 gap-2">
                  {gradientPresets.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => selectBg(p.type, p.value)}
                      className="relative h-20 rounded-xl overflow-hidden border-2 border-transparent hover:border-white/60 transition-all"
                      style={{ backgroundImage: p.value }}
                      title={p.name}
                    >
                      {currentBg.value === p.value && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-white/90 font-mono">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'color' && (
                <div className="grid grid-cols-3 gap-3">
                  {colorPresets.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => selectBg(p.type, p.value)}
                      className="h-16 rounded-2xl border-2 border-transparent hover:border-white/60 transition-all relative shadow-lg flex items-end justify-center pb-1.5"
                      style={{ backgroundColor: p.value }}
                      title={p.name}
                    >
                      {currentBg.value === p.value && (
                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                      )}
                      <span className="text-[10px] text-white/80 font-mono">{p.name}</span>
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
