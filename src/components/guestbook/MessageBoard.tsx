import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { MessageSquare, Send, Sparkles, User, Calendar, Check, Flame, Eye, Heart } from 'lucide-react';

interface CommentItem {
  id: number;
  name: string;
  contact?: string;
  content: string;
  date: string;
  isAdmin?: boolean;
  isBurnAfterReading?: boolean;
  likes?: number;
  hasAshFromAbove?: boolean;
}

const initialMessages: CommentItem[] = [
  {
    id: 1,
    name: '密信访客 · 阅后即焚示例',
    content: '这是一条「阅后即焚」密信！点击揭晓后开始 5 秒倒计时，倒计时结束将触发火焰焚毁消逝 🔥',
    date: '2026-11-26',
    isBurnAfterReading: true,
    likes: 5,
  },
  {
    id: 2,
    name: '小N同学',
    content: '磊大大的网站升级后动效太丝滑了！PMOS 产品模型很有启发，期待后续更多 AI 作品上线！',
    date: '2026-11-22',
    likes: 12,
  },
  {
    id: 3,
    name: 'Larry (站长)',
    content: '欢迎来到我的数字花园！有任何关于 AI 工具、PMOS 产品或技术交流的想法，欢迎随时在此留言互动（支持普通留言和 5 秒阅后即焚模式）。',
    date: '2026-11-20',
    isAdmin: true,
    likes: 18,
  },
];

// Tidewell 9x9 Coastal Pixel Icons for Masked & Morphing State
const TW_PIXEL_ICONS = [
  ['........k','......kkb','....kkwkb','..kkwwkb.','kkwwwkbb.','..kkkbb..','....kb...','....k....','.........'],
  ['...kkk...','..kbwbk..','.kbwbwbk.','kbwbwbwbk','kwbwbwbwk','.kbwbwbk.','..kbbbk..','...kkk...','.........'],
  ['....k....','....kb...','....kbb..','...wkbbb.','..wwkbbb.','....k....','kkkkkkkkk','.kpppppk.','..kkkkk..'],
  ['...kkk...','..kbbbk..','...kwk...','...kbk...','...kwk...','...kbk...','..kwwwk..','..kbbbk..','.kkkkkkk.'],
  ['.........','...kkk..k','..kbbbkkk','.kbwbbbbk','kbbbbbkkk','.kbbbbk.k','..kkkk...','.........','.........'],
  ['.........','...kkk...','..kbbbk..','.kbwwbbk.','kbw..kbbk','kb....kbk','bbbbbbbbb','kkkkkkkkk','.........'],
  ['....p....','.p..k..p.','...kpk...','..kpppk..','pkpppppkp','..kpppk..','...kpk...','.p..k..p.','....p....'],
];
const TW_PALETTE: Record<string, string> = { k: '#1F2430', b: '#7DA3BB', w: '#FFFFFF', p: '#DDAD95' };
const TW_STICKER_SHEET =
  'https://images.higgs.ai/?default=1&output=webp&url=' +
  encodeURIComponent('https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261118_061547_979f8673-f904-4102-90a0-6458bce33bc8.png') +
  '&w=700&q=85';

const TidewellPixelRow: React.FC = () => (
  <div className="flex items-center gap-1.5" aria-hidden="true">
    {TW_PIXEL_ICONS.map((rows, idx) => (
      <svg key={idx} viewBox="0 0 9 9" shapeRendering="crispEdges" className="w-5 h-5 shrink-0">
        {rows.map((row, y) =>
          row.split('').map((c, x) =>
            c !== '.' && TW_PALETTE[c] ? (
              <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={TW_PALETTE[c]} />
            ) : null
          )
        )}
      </svg>
    ))}
  </div>
);

type BiomeKind = 'meadow' | 'desert' | 'stone' | 'coast';

// Physical Biome Border Decorations: Meadow (grass + grazing sheep), Desert (sand + sandstorm), Stone, Coast
const BiomeDecoration: React.FC<{ biome: BiomeKind }> = ({ biome }) => {
  if (biome === 'meadow') {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl">
        {/* Lush Grass Strip along bottom edge */}
        <svg
          className="absolute bottom-0 inset-x-0 w-full h-9"
          viewBox="0 0 600 36"
          preserveAspectRatio="none"
        >
          <path
            d="M0 36 L0 24 Q12 8 22 24 Q34 6 44 24 Q58 10 68 24 Q82 5 94 24 Q108 12 118 24 Q134 6 146 24 Q162 11 174 24 Q190 7 204 24 Q218 10 232 24 Q248 4 260 24 Q276 12 288 24 Q304 6 318 24 Q334 10 348 24 Q364 5 378 24 Q394 11 408 24 Q424 7 438 24 Q454 10 468 24 Q484 6 498 24 Q514 12 528 24 Q544 7 558 24 Q574 10 588 24 L600 22 L600 36 Z"
            fill="#22c55e"
            fillOpacity="0.45"
          />
          <path
            d="M0 36 L0 28 Q16 14 28 28 Q42 12 56 28 Q72 15 86 28 Q104 11 118 28 Q136 16 150 28 Q168 12 184 28 Q202 15 218 28 Q236 11 252 28 Q270 16 286 28 Q304 12 320 28 Q338 15 354 28 Q372 12 388 28 Q406 16 422 28 Q440 11 456 28 Q474 15 490 28 Q508 12 524 28 Q542 16 558 28 Q576 12 600 28 L600 36 Z"
            fill="#16a34a"
            fillOpacity="0.7"
          />
          {/* Tiny meadow flowers */}
          <circle cx="72" cy="24" r="2.2" fill="#fef08a" />
          <circle cx="195" cy="22" r="2" fill="#ffffff" />
          <circle cx="342" cy="24" r="2.2" fill="#fbcfe8" />
          <circle cx="478" cy="22" r="2" fill="#fef08a" />
        </svg>

        {/* Cute Grazing Sheep on bottom-right grass */}
        <svg
          className="absolute bottom-2 right-6 w-14 h-10 drop-shadow-sm"
          viewBox="0 0 64 44"
        >
          {/* Legs */}
          <rect x="20" y="30" width="3.5" height="10" rx="1.5" fill="#3f3f46" />
          <rect x="27" y="30" width="3.5" height="10" rx="1.5" fill="#3f3f46" />
          <rect x="39" y="30" width="3.5" height="10" rx="1.5" fill="#3f3f46" />
          <rect x="45" y="30" width="3.5" height="10" rx="1.5" fill="#3f3f46" />
          {/* Fluffy wool body */}
          <circle cx="24" cy="23" r="9" fill="#fafaf9" stroke="#e4e4e7" strokeWidth="1" />
          <circle cx="33" cy="20" r="10" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1" />
          <circle cx="43" cy="22" r="9" fill="#fafaf9" stroke="#e4e4e7" strokeWidth="1" />
          <circle cx="33" cy="27" r="8" fill="#ffffff" />
          {/* Animated grazing head */}
          <g className="tw-sheep-head" style={{ transformOrigin: '20px 24px' }}>
            <ellipse cx="13" cy="25" rx="7.5" ry="6" fill="#27272a" />
            <ellipse cx="18" cy="21" rx="3" ry="1.8" transform="rotate(-25 18 21)" fill="#3f3f46" />
            <circle cx="10.5" cy="23.5" r="1.2" fill="#ffffff" />
            <circle cx="10.2" cy="23.5" r="0.6" fill="#09090b" />
          </g>
        </svg>
      </div>
    );
  }

  if (biome === 'desert') {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl">
        {/* Layered Golden Sand Dunes along bottom */}
        <svg
          className="absolute bottom-0 inset-x-0 w-full h-10"
          viewBox="0 0 600 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 L0 26 Q110 10 230 24 Q370 36 490 16 Q550 8 600 20 L600 40 Z"
            fill="#f59e0b"
            fillOpacity="0.35"
          />
          <path
            d="M0 40 L0 31 Q140 20 290 31 Q430 40 600 24 L600 40 Z"
            fill="#d97706"
            fillOpacity="0.52"
          />
          {/* Tiny pebbles */}
          <circle cx="95" cy="34" r="2" fill="#92400e" fillOpacity="0.55" />
          <circle cx="310" cy="35" r="1.6" fill="#92400e" fillOpacity="0.5" />
          <circle cx="485" cy="33" r="2.2" fill="#78350f" fillOpacity="0.5" />
        </svg>

        {/* Tiny Desert Cactus */}
        <svg className="absolute bottom-2.5 right-7 w-7 h-9 opacity-80" viewBox="0 0 28 36">
          <rect x="11" y="8" width="6" height="24" rx="3" fill="#15803d" />
          <path d="M11 20 H6 Q4 20 4 17 V13" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M17 16 H22 Q24 16 24 13 V10" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>

        {/* Periodic Slow Spinning Mini Sand Tornado (小龙卷风) */}
        <div className="tw-sandstorm-gust absolute bottom-1.5 -left-24 w-28 h-24 pointer-events-none flex items-end justify-center">
          <svg className="w-16 h-20 opacity-85" viewBox="0 0 64 80" fill="none">
            <ellipse cx="32" cy="14" rx="24" ry="5" fill="#f59e0b" fillOpacity="0.28" className="tw-tornado-spin" />
            <ellipse cx="30" cy="26" rx="19" ry="4.5" fill="#d97706" fillOpacity="0.32" />
            <ellipse cx="33" cy="38" rx="14" ry="4" fill="#f59e0b" fillOpacity="0.38" />
            <ellipse cx="31" cy="50" rx="9" ry="3" fill="#b45309" fillOpacity="0.42" />
            <ellipse cx="32" cy="61" rx="5" ry="2.2" fill="#d97706" fillOpacity="0.5" />
            <ellipse cx="32" cy="70" rx="2.5" ry="1.5" fill="#92400e" fillOpacity="0.55" />
            <circle cx="14" cy="20" r="1.5" fill="#fde68a" />
            <circle cx="48" cy="32" r="1.8" fill="#fbbf24" />
            <circle cx="22" cy="44" r="1.3" fill="#fde68a" />
          </svg>
        </div>
      </div>
    );
  }

  if (biome === 'stone') {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl">
        {/* Rugged Stone Masonry along bottom */}
        <svg
          className="absolute bottom-0 inset-x-0 w-full h-7"
          viewBox="0 0 600 28"
          preserveAspectRatio="none"
        >
          <rect x="0" y="16" width="84" height="12" rx="3" fill="#64748b" fillOpacity="0.45" stroke="#94a3b8" strokeOpacity="0.4" />
          <rect x="86" y="14" width="102" height="14" rx="3" fill="#475569" fillOpacity="0.45" stroke="#94a3b8" strokeOpacity="0.4" />
          <rect x="190" y="17" width="76" height="11" rx="3" fill="#64748b" fillOpacity="0.42" stroke="#94a3b8" strokeOpacity="0.4" />
          <rect x="268" y="13" width="114" height="15" rx="3" fill="#475569" fillOpacity="0.48" stroke="#94a3b8" strokeOpacity="0.4" />
          <rect x="384" y="16" width="96" height="12" rx="3" fill="#64748b" fillOpacity="0.44" stroke="#94a3b8" strokeOpacity="0.4" />
          <rect x="482" y="14" width="118" height="14" rx="3" fill="#475569" fillOpacity="0.46" stroke="#94a3b8" strokeOpacity="0.4" />
          {/* Tiny moss tuft */}
          <ellipse cx="188" cy="15" rx="8" ry="3" fill="#4ade80" fillOpacity="0.55" />
          <ellipse cx="382" cy="14" rx="9" ry="3" fill="#22c55e" fillOpacity="0.5" />
        </svg>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl">
      {/* Gentle Ocean Foam Waves along bottom */}
      <svg
        className="absolute bottom-0 inset-x-0 w-full h-8"
        viewBox="0 0 600 32"
        preserveAspectRatio="none"
      >
        <path
          d="M0 32 L0 20 Q75 10 150 20 T300 20 T450 20 T600 20 L600 32 Z"
          fill="#38bdf8"
          fillOpacity="0.32"
        />
        <path
          d="M0 32 L0 24 Q75 16 150 24 T300 24 T450 24 T600 24 L600 32 Z"
          fill="#0284c7"
          fillOpacity="0.42"
        />
      </svg>
    </div>
  );
};

// Realistic Flame + Tidewell Staggered Sparkles, Paper Plane Exit & SVG Turbulence
const BurnCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tonguesRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Anime.js v4: Animate SVG feDisplacementMap heat/ripple distortion & Tidewell elements
    const dispMap = document.querySelector('#burn-heat-filter feDisplacementMap');
    const turbulence = document.querySelector('#burn-heat-filter feTurbulence');
    let heatAnim: ReturnType<typeof animate> | null = null;
    let freqAnim: ReturnType<typeof animate> | null = null;

    if (dispMap) {
      heatAnim = animate(dispMap, {
        scale: [0, 18, 34, 12],
        duration: 1650,
        ease: 'inOutQuad',
      });
    }
    if (turbulence) {
      freqAnim = animate(turbulence, {
        baseFrequency: ['0.02 0.06', '0.05 0.14', '0.03 0.09'],
        duration: 1650,
        ease: 'linear',
      });
    }

    if (tonguesRef.current) {
      const tongues = tonguesRef.current.querySelectorAll('.flame-tongue');
      animate(tongues, {
        scaleY: [0.3, 1.35, 0.75, 1.5, 0],
        scaleX: [0.85, 1.15, 0.9, 1.1, 0.6],
        translateY: [24, -18, -42, -75],
        opacity: [0, 0.95, 0.85, 0],
        delay: stagger(45, { from: 'center' }),
        duration: 1550,
        ease: 'outCubic',
      });
    }

    // Tidewell 4-point sparkles pop with back-out spring
    if (sparklesRef.current) {
      const spks = sparklesRef.current.querySelectorAll('.tw-burn-sparkle');
      animate(spks, {
        scale: [0, 1.25, 0],
        rotate: [-14, 24, 55],
        translateY: [0, -32],
        opacity: [0, 1, 0],
        delay: stagger(70, { from: 'center' }),
        duration: 1350,
        ease: 'outCubic',
      });
    }

    // Tidewell paper plane glides out diagonally as the message burns away
    if (planeRef.current) {
      animate(planeRef.current, {
        translateX: [-20, 180, 380],
        translateY: [10, -28, -72],
        rotate: [-8, -16, -24],
        scale: [0.4, 1.05, 0.5],
        opacity: [0, 1, 0],
        duration: 1450,
        ease: 'inOutCubic',
      });
    }

    // 2. HTML5 Canvas: Physical rising fire particles, glowing sparks & charred ash
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.offsetWidth || 600);
    const h = (canvas.height = canvas.offsetHeight || 160);
    const startTime = performance.now();
    let raf: number;

    interface Ember {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      life: number;
      maxLife: number;
      isAsh: boolean;
      rot: number;
      rotV: number;
    }

    const particles: Ember[] = [];

    const render = (now: number) => {
      const elapsed = Math.min(1, (now - startTime) / 1600);
      const burnLineY = h * (1 - elapsed * 1.15);

      ctx.clearRect(0, 0, w, h);

      // Charred dark area + glowing orange-red combustion front
      if (burnLineY < h) {
        const charGrad = ctx.createLinearGradient(0, burnLineY - 14, 0, h);
        charGrad.addColorStop(0, 'rgba(255, 140, 30, 0.92)');
        charGrad.addColorStop(0.14, 'rgba(239, 68, 68, 0.75)');
        charGrad.addColorStop(0.32, 'rgba(28, 18, 16, 0.94)');
        charGrad.addColorStop(1, 'rgba(12, 12, 14, 0.98)');
        ctx.fillStyle = charGrad;
        ctx.fillRect(0, Math.max(0, burnLineY), w, h);
      }

      // Spawn glowing flame embers & dark ash flakes along the burning edge
      for (let i = 0; i < 12; i++) {
        const isAsh = Math.random() > 0.56;
        particles.push({
          x: Math.random() * w,
          y: Math.max(0, Math.min(h, burnLineY + (Math.random() - 0.5) * 18)),
          vx: (Math.random() - 0.5) * 1.8,
          vy: isAsh ? 0.7 + Math.random() * 1.9 : -(1.8 + Math.random() * 3.8),
          r: isAsh ? 1.8 + Math.random() * 2.6 : 1.6 + Math.random() * 3.4,
          life: 0,
          maxLife: 24 + Math.random() * 34,
          isAsh,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.24,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx + Math.sin(p.life * 0.22) * 0.45;
        p.y += p.vy;
        p.rot += p.rotV;
        const alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        if (p.isAsh) {
          ctx.fillStyle = '#52525b';
          ctx.fillRect(-p.r, -p.r * 0.6, p.r * 2, p.r * 1.2);
        } else {
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 2.4);
          g.addColorStop(0, '#fffbeb');
          g.addColorStop(0.35, '#fb923c');
          g.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (elapsed < 1 || particles.length > 0) {
        raf = requestAnimationFrame(render);
      }
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      heatAnim?.pause();
      freqAnim?.pause();
    };
  }, []);

  return (
    <>
      <div
        ref={tonguesRef}
        className="absolute inset-x-0 bottom-0 h-24 flex items-end justify-around pointer-events-none z-25 overflow-hidden"
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="flame-tongue w-7 h-16 rounded-t-full opacity-0"
            style={{
              background:
                'radial-gradient(circle at 50% 80%, #fef08a 0%, #DDAD95 35%, #f97316 55%, rgba(220,38,38,0) 85%)',
              filter: 'blur(3px)',
              transformOrigin: 'bottom center',
            }}
          />
        ))}
      </div>
      {/* Tidewell 4-point Sparkles */}
      <div ref={sparklesRef} className="absolute inset-0 flex items-center justify-around pointer-events-none z-35">
        {Array.from({ length: 6 }).map((_, i) => (
          <svg key={i} className="tw-burn-sparkle w-5 h-5 opacity-0" viewBox="0 0 20 20">
            <path
              d="M10 0c.8 5.6 3.6 8.6 10 10-6.4 1.4-9.2 4.4-10 10-.8-5.6-3.6-8.6-10-10 6.4-1.4 9.2-4.4 10-10z"
              fill={i % 2 === 0 ? '#F4E3D3' : '#DDAD95'}
            />
          </svg>
        ))}
      </div>
      {/* Tidewell Paper Plane Glide-out */}
      <div
        ref={planeRef}
        className="absolute left-8 bottom-4 w-11 h-11 pointer-events-none z-35 opacity-0"
        style={{
          backgroundImage: `url('${TW_STICKER_SHEET}')`,
          backgroundSize: '336.7% 492.6%',
          backgroundPosition: '84.5% 77%',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-30" />
    </>
  );
};

// Organic Physical Ash Pile settled on the top edge of the next card (animated via Anime.js stagger)
const AshPile: React.FC = () => {
  const pileRef = useRef<HTMLDivElement>(null);
  const flakes = React.useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        left: `${(i / 42) * 100 + Math.sin(i * 3.1) * 1.5}%`,
        top: `${(i % 4) * 2.2}px`,
        w: 3 + (i % 5) * 1.4,
        h: 2 + (i % 3) * 1.1,
        rot: (i * 37) % 180,
        ember: i % 11 === 0,
        opacity: 0.45 + ((i * 7) % 5) * 0.11,
      })),
    []
  );

  useEffect(() => {
    if (!pileRef.current) return;
    const nodes = pileRef.current.querySelectorAll('.ash-flake');
    animate(nodes, {
      translateY: [-14, 0],
      opacity: [0, 0.85],
      delay: stagger(16, { from: 'center' }),
      duration: 650,
      ease: 'outBounce',
    });
  }, []);

  return (
    <div
      ref={pileRef}
      className="absolute top-0 inset-x-0 h-4 pointer-events-none z-20 overflow-hidden"
      title="上一条阅后即焚卡片化成的物理灰烬"
    >
      <div className="w-full h-1.5 bg-gradient-to-b from-zinc-500/50 via-zinc-600/20 to-transparent blur-[1px]" />
      {flakes.map((f, idx) => (
        <span
          key={idx}
          style={{
            left: f.left,
            top: f.top,
            width: `${f.w}px`,
            height: `${f.h}px`,
            transform: `rotate(${f.rot}deg)`,
            opacity: f.opacity,
          }}
          className={`ash-flake absolute rounded-[1px] ${
            f.ember
              ? 'bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.9)] animate-pulse'
              : 'bg-zinc-400 dark:bg-zinc-500'
          }`}
        />
      ))}
    </div>
  );
};

export const MessageBoard: React.FC = () => {
  const [messages, setMessages] = useState<CommentItem[]>(initialMessages);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [content, setContent] = useState('');
  const [isBurnMode, setIsBurnMode] = useState(false);
  const [toast, setToast] = useState('');

  const [revealedIds, setRevealedIds] = useState<Record<number, number>>({});
  const [burningIds, setBurningIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('guestbook_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      } catch {}
    }
  }, []);

  // 5-second countdown tick
  useEffect(() => {
    const activeIds = Object.keys(revealedIds).map(Number);
    if (activeIds.length === 0) return;

    const timer = setInterval(() => {
      setRevealedIds((prev) => {
        const next: Record<number, number> = {};
        const toBurn: number[] = [];

        for (const [idStr, sec] of Object.entries(prev)) {
          const id = Number(idStr);
          if (sec <= 1) {
            toBurn.push(id);
          } else {
            next[id] = sec - 1;
          }
        }

        if (toBurn.length > 0) {
          toBurn.forEach((id) => triggerBurnAnimation(id));
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [revealedIds]);

  const triggerBurnAnimation = (id: number) => {
    setBurningIds((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setMessages((curr) => {
        const updated = curr.filter((m) => m.id !== id);
        localStorage.setItem('guestbook_messages', JSON.stringify(updated));
        return updated;
      });
      setBurningIds((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, 1650);
  };

  const revealBurnMessage = (id: number) => {
    if (revealedIds[id] !== undefined || burningIds[id]) return;
    setRevealedIds((prev) => ({ ...prev, [id]: 5 }));
  };

  const handleLike = (id: number) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m));
    setMessages(updated);
    localStorage.setItem('guestbook_messages', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';

    const newMsg: CommentItem = {
      id: Date.now(),
      name: name.trim(),
      contact: contact.trim(),
      content: content.trim(),
      date: new Date().toLocaleDateString('zh-CN'),
      isAdmin,
      isBurnAfterReading: isBurnMode,
      likes: 0,
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem('guestbook_messages', JSON.stringify(updated));

    setName('');
    setContact('');
    setContent('');
    setToast(isBurnMode ? '🔥 5s 阅后即焚加密留言已发布！' : '✨ 留言发布成功！');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      <div className="p-6 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">
          <MessageSquare className="w-4 h-4" /> Community Guestbook
        </div>
        <p className="text-xs sm:text-sm text-charcoal-100 dark:text-cream-300 leading-relaxed font-serif">
          欢迎在此写下想法、点赞或申请友链，支持普通留言与 <strong>5s 阅后即焚</strong>。
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-lg font-bold text-charcoal-DEFAULT dark:text-cream-50 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta" />
            留下你的足迹
          </h2>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                const next = !isBurnMode;
                setIsBurnMode(next);
                if (next) {
                  const host = e.currentTarget.parentElement;
                  if (host) {
                    const sparks = host.querySelectorAll('.ignite-spark');
                    animate(sparks, {
                      translateX: [0, (_el, i) => (i - 2.5) * 14],
                      translateY: [0, (_el, i) => -14 - (i % 3) * 8],
                      scale: [0.3, 1.15, 0],
                      opacity: [0, 1, 0],
                      duration: 600,
                      ease: 'outCubic',
                    });
                  }
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                isBurnMode
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-400 shadow-[0_0_14px_rgba(249,115,22,0.55)]'
                  : 'glass border-charcoal-500/15 dark:border-white/15 text-charcoal-200 dark:text-cream-300 hover:border-orange-400/50'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${isBurnMode ? 'animate-pulse text-yellow-200' : ''}`} />
              <span>阅后即焚</span>
            </button>
            {/* Mini ignition flame sparks when toggling ON */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="ignite-spark absolute w-2 h-2 rounded-full opacity-0"
                  style={{
                    background: i % 2 === 0 ? '#fde047' : '#f97316',
                    boxShadow: '0 0 6px rgba(249,115,22,0.9)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="您的昵称 *"
            required
            className="w-full px-3.5 py-2.5 rounded-xl glass text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta/50"
          />
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="联系方式 / 个人网站 (可选)"
            className="w-full px-3.5 py-2.5 rounded-xl glass text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta/50"
          />
        </div>

        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isBurnMode ? '写下加密留言（打马赛克，点击阅读 5s 后火焰焚毁）...' : '写下你的留言、建议或友链申请...'}
          required
          className="w-full p-3.5 rounded-xl glass text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta/50"
        />

        <div className="flex items-center justify-between">
          {toast ? (
            <span className="text-xs font-mono text-emerald-500 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> {toast}
            </span>
          ) : <span />}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta hover:bg-terracotta/90 text-white text-xs font-mono font-semibold shadow-lg transition-transform active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isBurnMode ? '加密发送' : '发布留言'}</span>
          </button>
        </div>
      </form>

      {/* Hidden SVG Heat Turbulence Filter for Realistic Fire Distortion */}
      <svg className="w-0 h-0 absolute pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="burn-heat-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.06" numOctaves={3} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={0} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Biome Animation Styles */}
      <style>{`
        @keyframes sheepGraze {
          0%, 40%, 100% { transform: rotate(0deg) translateY(0); }
          55%, 78% { transform: rotate(-28deg) translateY(3px); }
          66% { transform: rotate(-22deg) translateY(2px); }
        }
        .tw-sheep-head {
          animation: sheepGraze 3.8s ease-in-out infinite;
        }
        @keyframes sandstormSweep {
          0%, 35% { transform: translateX(0%) scaleX(0.95); opacity: 0; }
          45% { opacity: 0.9; }
          88% { transform: translateX(480%) scaleX(1.05); opacity: 0.85; }
          100% { transform: translateX(520%); opacity: 0; }
        }
        .tw-sandstorm-gust {
          animation: sandstormSweep 13s ease-in-out infinite;
        }
      `}</style>

      {/* Cards List */}
      <div className="space-y-5">
        <AnimatePresence>
          {messages.map((msg, idx) => {
            const countdown = revealedIds[msg.id];
            const isRevealed = countdown !== undefined;
            const isBurning = !!burningIds[msg.id];
            const biomeThemes: Array<{ kind: BiomeKind; label: string; cls: string; badge: string }> = [
              {
                kind: 'meadow',
                label: '🌿 草原',
                cls: 'border-2 border-emerald-500/45 shadow-[inset_0_0_0_2px_rgba(16,185,129,0.14)] bg-white/85 dark:bg-zinc-900/75',
                badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
              },
              {
                kind: 'desert',
                label: '🏜️ 荒漠',
                cls: 'border-2 border-amber-500/45 shadow-[inset_0_0_0_2px_rgba(245,158,11,0.14)] bg-white/85 dark:bg-zinc-900/75',
                badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25',
              },
              {
                kind: 'stone',
                label: '🪨 石壁',
                cls: 'border-2 border-slate-400/50 shadow-[inset_0_0_0_2px_rgba(148,163,184,0.20)] bg-white/85 dark:bg-zinc-900/75',
                badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-400/30',
              },
              {
                kind: 'coast',
                label: '🌊 海岸',
                cls: 'border-2 border-sky-400/45 shadow-[inset_0_0_0_2px_rgba(56,189,248,0.14)] bg-white/85 dark:bg-zinc-900/75',
                badge: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-400/25',
              },
            ];
            const biome = biomeThemes[idx % biomeThemes.length];

            return (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={
                  isBurning
                    ? { opacity: 0.72, scale: 0.985 }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.45 }}
                style={isBurning ? { filter: 'url(#burn-heat-filter)' } : undefined}
                className={`relative rounded-2xl p-6 sm:p-7 pb-11 sm:pb-12 transition-all overflow-hidden ${biome.cls}`}
              >
                <BiomeDecoration biome={biome.kind} />
                {isBurning && <BurnCanvas />}

                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center text-xs font-bold">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-sm text-charcoal-DEFAULT dark:text-cream-50">{msg.name}</span>
                    {msg.isAdmin && (
                      <span className="px-2 py-0.5 rounded-full bg-terracotta text-white text-[10px] font-mono">站长</span>
                    )}
                    {msg.isBurnAfterReading && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-500 text-[10px] font-mono flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {isRevealed ? `${countdown}s 后焚毁` : '5s 阅后即焚'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-charcoal-100 dark:text-cream-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {msg.date}
                    </span>
                    <button
                      onClick={() => handleLike(msg.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-rose-500/10 text-rose-400 transition-colors"
                    >
                      <Heart className="w-3 h-3 fill-current" />
                      <span>{msg.likes || 0}</span>
                    </button>
                  </div>
                </div>

                {msg.isBurnAfterReading && !isRevealed && !isBurning ? (
                  <div
                    onClick={() => revealBurnMessage(msg.id)}
                    className="relative cursor-pointer rounded-xl p-4 bg-[#F1ECEA]/85 dark:bg-white/5 border border-[#1F2430]/10 dark:border-white/10 overflow-hidden group"
                  >
                    <p className="text-sm leading-relaxed blur-[9px] select-none opacity-45">
                      {msg.content}
                    </p>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F1ECEA]/70 dark:bg-zinc-950/60 backdrop-blur-[2px] group-hover:bg-[#F1ECEA]/55 dark:group-hover:bg-zinc-950/50 transition-colors">
                      <TidewellPixelRow />
                      <span className="px-4 py-1.5 rounded-full bg-[#1F2430] text-[#F1ECEA] text-xs font-mono flex items-center gap-1.5 shadow-xl border border-white/15 group-hover:scale-105 transition-transform">
                        <Eye className="w-3.5 h-3.5 text-[#DDAD95]" />
                        点击揭晓密信（5s 后随焰消逝）
                      </span>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={msg.isBurnAfterReading ? { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 } : false}
                    animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                    transition={{ duration: 0.65, ease: [0.25, 0.75, 0.2, 1] }}
                  >
                    <p className="text-sm text-charcoal-200 dark:text-cream-200 leading-relaxed">
                      {msg.content}
                    </p>
                    {isRevealed && !isBurning && (
                      <div className="mt-2.5 h-1 w-full rounded-full bg-orange-500/15 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#DDAD95] via-orange-500 to-rose-500 transition-all duration-1000 ease-linear"
                          style={{ width: `${(countdown / 5) * 100}%` }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {msg.contact && (!msg.isBurnAfterReading || isRevealed) && (
                  <div className="mt-2 text-[11px] font-mono text-terracotta/80">
                    🔗 {msg.contact}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
