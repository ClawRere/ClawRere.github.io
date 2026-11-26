import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown, X, Check } from 'lucide-react';
import { FireworksOverlay } from './FireworksOverlay';

const wallpaperPresets = [
  { name: '星海深空', url: '/img/starry-sky.jpg', type: 'image' },
  { name: '极光雪山', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop', type: 'image' },
  { name: '赛博流光', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop', type: 'image' },
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
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const [phrases, setPhrases] = useState<string[]>(defaultPhrases);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'gradient' | 'color'>('wallpaper');

  // Custom color & gradient controls
  const [customColor, setCustomColor] = useState('#D97757');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [gradStart, setGradStart] = useState('#667eea');
  const [gradEnd, setGradEnd] = useState('#764ba2');
  const [gradAngle, setGradAngle] = useState(135);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('blogbg');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.type && parsed?.value) {
          setCurrentBg(parsed);
          const cssVal = parsed.type === 'image' ? `url("${parsed.value}") center/cover no-repeat` : parsed.value;
          document.documentElement.style.setProperty('--hero-bg', cssVal);
        }
      }
    } catch {}
    setHasLoadedStorage(true);

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
    const cssVal = type === 'image' ? `url("${value}") center/cover no-repeat` : value;
    document.documentElement.style.setProperty('--hero-bg', cssVal);
    const globalBg = document.getElementById('global-blurred-bg');
    if (globalBg) globalBg.style.background = cssVal;
    setIsOpen(false);
  };

  const defaultBgCss = `url("${wallpaperPresets[0].url}") center/cover no-repeat`;
  const customGradPreview = `linear-gradient(${gradAngle}deg, ${gradStart}, ${gradEnd})`;
  const activePhrase = phrases[phraseIndex % phrases.length] || defaultPhrases[0];

  const resolvedStyle: React.CSSProperties = hasLoadedStorage
    ? currentBg.type === 'image'
      ? { backgroundImage: `url("${currentBg.value}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : currentBg.type === 'color'
      ? { backgroundColor: currentBg.value }
      : { backgroundImage: currentBg.value }
    : { background: `var(--hero-bg, ${defaultBgCss})` };

  return (
    <div
      style={resolvedStyle}
      className="relative w-full h-[calc(100vh-3.5rem)] min-h-[540px] flex flex-col items-center justify-center overflow-hidden mb-14 transition-all duration-500"
    >
      {/* Center Minimal Title + Lightweight Tidewell Wipe-in & Pixel Accent (shifted up for enlarged bottom fan cards) */}
      <div className="relative z-20 text-center px-6 max-w-3xl mx-auto -mt-36 sm:-mt-44">
        {/* Lightweight Tidewell 4-point sparkle + coastal pixel badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.75, 0.2, 1] }}
          className="mb-4 flex items-center justify-center gap-2"
        >
          <span className="px-3 py-1 rounded-full bg-[#F1ECEA]/90 text-[#1F2430] text-[11px] font-mono font-semibold shadow-lg -rotate-2">
            AI · PMOS
          </span>
          <svg className="w-4 h-4 text-[#F4E3D3]" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 0c.8 5.6 3.6 8.6 10 10-6.4 1.4-9.2 4.4-10 10-.8-5.6-3.6-8.6-10-10 6.4-1.4 9.2-4.4 10-10z" fill="currentColor" />
          </svg>
          <span className="px-3 py-1 rounded-full bg-[#DDAD95]/95 text-[#1F2430] text-[11px] font-mono font-semibold shadow-lg rotate-2">
            93+ 动效
          </span>
        </motion.div>

        <motion.h1
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.3, y: 12 }}
          animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.25, 0.75, 0.2, 1] }}
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

      {/* Random-position "放个烟花" button & canvas overlay */}
      <FireworksOverlay />

      {/* Scroll Down Arrow */}
      <motion.a
        href="#hub-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 p-1.5 rounded-full text-white/80 hover:text-white drop-shadow transition-colors"
        aria-label="向下滚动"
      >
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.a>

      {/* Subtle Cover Switcher Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-8 right-6 z-30 p-3 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-md border border-white/25 text-white transition-all shadow-lg hover:scale-105"
        title="切换封面壁纸 / 自定义纯色 / 自定义渐变"
      >
        <Palette className="w-4 h-4" />
      </button>

      {/* Enlarged Switcher Modal (max-w-2xl) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full max-w-2xl rounded-3xl bg-zinc-900/95 border border-white/15 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">自定义首页封面背景</h3>
                  <p className="text-xs text-white/50 mt-0.5">支持高清壁纸、自定义双色渐变与任意纯色</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-1.5 p-1 rounded-xl bg-white/8 mb-5">
                {(['wallpaper', 'gradient', 'color'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      activeTab === tab ? 'bg-white text-black shadow' : 'text-white/65 hover:text-white'
                    }`}
                  >
                    {tab === 'wallpaper' ? '高清壁纸 (12)' : tab === 'gradient' ? '流光渐变 / 自定义' : '纯色 / 调色盘'}
                  </button>
                ))}
              </div>

              {activeTab === 'wallpaper' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
                    {wallpaperPresets.map((p) => (
                      <button
                        key={p.url}
                        onClick={() => selectBg(p.type, p.url)}
                        className="relative h-24 rounded-2xl overflow-hidden border-2 border-transparent hover:border-white/70 transition-all group"
                        style={{ backgroundImage: `url(${p.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        title={p.name}
                      >
                        {currentBg.value === p.url && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-[11px] text-white/95 truncate px-1.5">{p.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Paste Custom / Gallery Image URL */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center gap-2">
                    <input
                      type="url"
                      placeholder="粘贴图库链接或任意壁纸 URL (https://...)"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-mono text-white"
                    />
                    <button
                      onClick={() => {
                        if (customImageUrl.trim()) {
                          selectBg('image', customImageUrl.trim());
                          setCustomImageUrl('');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta/90 text-white text-xs font-mono font-semibold"
                    >
                      应用链接
                    </button>
                    <a href="/entertain/gallery" className="text-[11px] font-mono text-amber-300 hover:underline px-1">
                      去图库挑一张 →
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'gradient' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-3">
                    {gradientPresets.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => selectBg(p.type, p.value)}
                        className="relative h-20 rounded-2xl overflow-hidden border-2 border-transparent hover:border-white/70 transition-all"
                        style={{ backgroundImage: p.value }}
                      >
                        {currentBg.value === p.value && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <span className="absolute bottom-1.5 left-0 right-0 text-center text-[11px] text-white font-mono drop-shadow">{p.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Gradient Builder */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="text-xs font-mono text-white/70">自定义双色渐变生成器</div>
                    <div className="h-14 rounded-xl border border-white/15 shadow-inner" style={{ backgroundImage: customGradPreview }} />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs font-mono">
                          <span>起色</span>
                          <input type="color" value={gradStart} onChange={(e) => setGradStart(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-mono">
                          <span>终色</span>
                          <input type="color" value={gradEnd} onChange={(e) => setGradEnd(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-mono">
                          <span>角度 {gradAngle}°</span>
                          <input type="range" min={0} max={360} value={gradAngle} onChange={(e) => setGradAngle(Number(e.target.value))} className="w-24 accent-terracotta" />
                        </label>
                      </div>
                      <button
                        onClick={() => selectBg('gradient', customGradPreview)}
                        className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta/90 text-white text-xs font-mono font-semibold"
                      >
                        应用自定义渐变
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'color' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {colorPresets.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => selectBg(p.type, p.value)}
                        className="h-20 rounded-2xl border-2 border-transparent hover:border-white/70 transition-all relative shadow-lg flex items-end justify-center pb-2"
                        style={{ backgroundColor: p.value }}
                        title={p.name}
                      >
                        {currentBg.value === p.value && (
                          <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
                        )}
                        <span className="text-[10px] text-white/90 font-mono">{p.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Solid Color Picker */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-11 h-11 rounded-xl cursor-pointer bg-transparent border-0"
                      />
                      <div>
                        <div className="text-xs font-mono text-white/60 mb-1">自定义纯色 (HEX)</div>
                        <input
                          type="text"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          className="w-28 px-2.5 py-1 rounded-lg bg-black/40 border border-white/15 text-xs font-mono text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => selectBg('color', customColor)}
                      className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta/90 text-white text-xs font-mono font-semibold"
                    >
                      应用自定义纯色
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
