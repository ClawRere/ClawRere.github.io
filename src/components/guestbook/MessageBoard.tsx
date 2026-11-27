import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { MessageSquare, Send, Sparkles, User, Calendar, Check, Flame, Eye, Heart, Trash2 } from 'lucide-react';

interface ReplyItem {
  id: number;
  name: string;
  avatar?: string;
  content: string;
  date: string;
  isAdmin?: boolean;
}

interface CommentItem {
  id: number;
  name: string;
  avatar?: string;
  contact?: string;
  content: string;
  date: string;
  isAdmin?: boolean;
  isBurnAfterReading?: boolean;
  likes?: number;
  replies?: ReplyItem[];
  biome?: BiomeKind;
}

const ALL_BIOMES: BiomeKind[] = ['meadow', 'desert', 'stone', 'mountain', 'cornfield', 'coast'];

const initialMessages: CommentItem[] = [
  {
    id: 1,
    name: '密信访客 · 阅后即焚示例',
    content: '这是一条「阅后即焚」密信！点击揭晓后开始 5 秒倒计时，进度条完全归零后触发火焰粒子焚毁消逝 🔥',
    date: '2026-11-26',
    isBurnAfterReading: true,
    likes: 5,
    biome: 'meadow',
    replies: [
      {
        id: 101,
        name: 'Larry (站长)',
        content: '欢迎测试 5s 阅后即焚密信功能，焚毁后刷新也不会恢复～',
        date: '2026-11-26',
        isAdmin: true,
      },
    ],
  },
  {
    id: 2,
    name: '小N同学',
    content: '磊大大的网站升级后动效太丝滑了！PMOS 产品模型很有启发，期待后续更多 AI 作品上线！',
    date: '2026-11-22',
    likes: 12,
    biome: 'desert',
    replies: [
      {
        id: 201,
        name: 'Larry (站长)',
        content: '谢谢认可！PMOS 后续还会继续迭代工作流与基线管理能力，欢迎多提建议 ✨',
        date: '2026-11-23',
        isAdmin: true,
      },
      {
        id: 202,
        name: '产品新人阿K',
        content: '同蹲 PMOS 更新！假设与事实分层那个思路太实用了！',
        date: '2026-11-24',
      },
    ],
  },
  {
    id: 3,
    name: 'Larry (站长)',
    content: '欢迎来到我的数字花园！有任何关于 AI 工具、PMOS 产品或技术交流的想法，欢迎随时在此留言互动（支持嵌套回复与 5 秒阅后即焚）。',
    date: '2026-11-20',
    isAdmin: true,
    likes: 18,
    biome: 'stone',
    replies: [
      {
        id: 301,
        name: '路过的全栈喵',
        content: '右下角的柯基好可爱！',
        date: '2026-11-25',
      },
    ],
  },
  {
    id: 4,
    name: '山海行者',
    content: '山脉卡片的雪峰层峦叠嶂，搭配右侧天气动效很有氛围感！',
    date: '2026-11-24',
    likes: 7,
    biome: 'mountain',
  },
  {
    id: 5,
    name: '麦田守望者',
    content: '玉米地主题暖暖的很有秋日气息，每张卡片还能独立切换晴雨雪风雷～',
    date: '2026-11-23',
    likes: 9,
    biome: 'cornfield',
  },
  {
    id: 6,
    name: '观澜设计师',
    content: '海岸主题的浪花和友链里的美叶灵感都很赞，已加入常用书签！',
    date: '2026-11-21',
    likes: 14,
    biome: 'coast',
  },
  {
    id: 7,
    name: '林深见鹿',
    content: '刚从博客归档逛过来，用大模型提示词工程那篇整理帮大忙了，排版很舒服。',
    date: '2026-11-20',
    likes: 8,
    biome: 'meadow',
  },
  {
    id: 8,
    name: 'Coding_阿哲',
    content: '前端动效库居然收藏了这么多原生 CSS/Canvas 效果，学习了不少微交互思路！',
    date: '2026-11-19',
    likes: 11,
    biome: 'desert',
  },
  {
    id: 9,
    name: '苏打水不加冰',
    content: '雨声院和音乐馆搭配写代码太治愈了，顺便问下友链申请需要什么条件呀？',
    date: '2026-11-18',
    likes: 6,
    biome: 'stone',
    replies: [
      {
        id: 901,
        name: 'Larry (站长)',
        content: '只要是认真维护的个人博客或独立作品站都欢迎，直接在这里留下站点名称和链接就行～',
        date: '2026-11-18',
        isAdmin: true,
      },
    ],
  },
  {
    id: 10,
    name: '半夏微凉',
    content: '关于页的 ENTP 形象和柯基狗狗很有记忆点，看得出来花了很多心思打磨细节。',
    date: '2026-11-16',
    likes: 15,
    biome: 'mountain',
  },
  {
    id: 11,
    name: 'Product_Mia',
    content: 'PMOS 把需求对话、证据分层和版本基线串起来的想法很棒，期待开源或体验版！',
    date: '2026-11-15',
    likes: 10,
    biome: 'cornfield',
  },
  {
    id: 12,
    name: '夜航船',
    content: '偶然点进来的小站，首页切换壁纸和放烟花的小彩蛋让人会心一笑，祝越做越好！',
    date: '2026-11-14',
    likes: 19,
    biome: 'coast',
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

type BiomeKind = 'meadow' | 'desert' | 'stone' | 'mountain' | 'cornfield' | 'coast';
type WeatherKind = 'sunny' | 'rainy' | 'snowy' | 'wind' | 'thunder';

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

        {/* Periodic Slow Full-Width Spinning Mini Sand Tornado + Trailing Dust */}
        <div className="tw-sandstorm-gust absolute bottom-1 w-36 h-24 pointer-events-none flex items-end justify-center">
          {/* Trailing swirling sand dust */}
          <div className="absolute -left-10 bottom-1 w-24 h-10 rounded-full bg-amber-400/20 blur-md" />
          <span className="absolute -left-8 bottom-3 w-2 h-1 rounded-full bg-amber-300/75" />
          <span className="absolute -left-4 bottom-7 w-1.5 h-1.5 rounded-full bg-amber-200/80" />
          <span className="absolute -left-12 bottom-5 w-2.5 h-1 rounded-full bg-orange-300/70" />
          <span className="absolute right-1 bottom-4 w-1.5 h-1.5 rounded-full bg-amber-300/80" />
          <svg className="w-16 h-20 opacity-90" viewBox="0 0 64 80" fill="none">
            <ellipse cx="32" cy="14" rx="24" ry="5" fill="#f59e0b" fillOpacity="0.30" />
            <ellipse cx="30" cy="26" rx="19" ry="4.5" fill="#d97706" fillOpacity="0.34" />
            <ellipse cx="33" cy="38" rx="14" ry="4" fill="#f59e0b" fillOpacity="0.40" />
            <ellipse cx="31" cy="50" rx="9" ry="3" fill="#b45309" fillOpacity="0.45" />
            <ellipse cx="32" cy="61" rx="5" ry="2.2" fill="#d97706" fillOpacity="0.52" />
            <ellipse cx="32" cy="70" rx="2.5" ry="1.5" fill="#92400e" fillOpacity="0.60" />
            <circle cx="14" cy="20" r="1.6" fill="#fde68a" />
            <circle cx="48" cy="32" r="1.8" fill="#fbbf24" />
            <circle cx="22" cy="44" r="1.4" fill="#fde68a" />
          </svg>
        </div>
      </div>
    );
  }

  if (biome === 'stone') {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl">
        {/* Jagged, Cracked, Uneven Varied-Size Stone Masonry */}
        <svg
          className="absolute bottom-0 inset-x-0 w-full h-11"
          viewBox="0 0 600 44"
          preserveAspectRatio="none"
        >
          <polygon points="0,44 0,20 42,15 76,24 88,44" fill="#64748b" fillOpacity="0.52" stroke="#94a3b8" strokeOpacity="0.45" />
          <polygon points="72,44 82,22 128,10 174,19 182,44" fill="#475569" fillOpacity="0.56" stroke="#94a3b8" strokeOpacity="0.45" />
          <polygon points="168,44 178,27 215,24 238,31 246,44" fill="#64748b" fillOpacity="0.46" stroke="#94a3b8" strokeOpacity="0.4" />
          <polygon points="236,44 248,14 302,8 348,22 356,44" fill="#334155" fillOpacity="0.55" stroke="#94a3b8" strokeOpacity="0.45" />
          <polygon points="344,44 354,24 410,16 446,28 454,44" fill="#64748b" fillOpacity="0.5" stroke="#94a3b8" strokeOpacity="0.45" />
          <polygon points="442,44 456,12 520,18 552,11 600,22 600,44" fill="#475569" fillOpacity="0.56" stroke="#94a3b8" strokeOpacity="0.45" />
          {/* Cracks & moss */}
          <path d="M128 10 L136 24 L124 34" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeOpacity="0.6" />
          <path d="M302 8 L294 21 L306 32" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeOpacity="0.6" />
          <ellipse cx="176" cy="24" rx="9" ry="3.5" fill="#4ade80" fillOpacity="0.6" />
          <ellipse cx="450" cy="18" rx="10" ry="3.2" fill="#22c55e" fillOpacity="0.55" />
        </svg>
      </div>
    );
  }

  if (biome === 'mountain') {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl">
        {/* Layered Misty Mountain Peaks with Snow Caps */}
        <svg className="absolute bottom-0 inset-x-0 w-full h-12" viewBox="0 0 600 48" preserveAspectRatio="none">
          <polygon points="0,48 65,14 140,48" fill="#475569" fillOpacity="0.38" />
          <polygon points="95,48 185,6 285,48" fill="#334155" fillOpacity="0.48" />
          <polygon points="164,16 185,6 208,16 196,19 185,15 174,19" fill="#f8fafc" fillOpacity="0.8" />
          <polygon points="240,48 345,12 450,48" fill="#475569" fillOpacity="0.42" />
          <polygon points="390,48 490,8 600,48" fill="#334155" fillOpacity="0.52" />
          <polygon points="468,17 490,8 514,18 500,20 490,16 479,20" fill="#f8fafc" fillOpacity="0.85" />
        </svg>
      </div>
    );
  }

  if (biome === 'cornfield') {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl">
        {/* Swaying Golden-Green Cornfield along bottom */}
        <svg className="absolute bottom-0 inset-x-0 w-full h-11" viewBox="0 0 600 44" preserveAspectRatio="none">
          <rect y="36" width="600" height="8" fill="#78350f" fillOpacity="0.4" />
          {[28, 76, 128, 182, 240, 296, 352, 408, 464, 520, 568].map((x, idx) => (
            <g key={x}>
              <path d={`M${x} 40 Q${x + (idx % 2 === 0 ? 4 : -4)} 22 ${x} 8`} stroke="#15803d" strokeWidth="3" fill="none" strokeOpacity="0.7" />
              <ellipse cx={x + 4} cy="22" rx="3" ry="6" transform={`rotate(22 ${x + 4} 22)`} fill="#facc15" fillOpacity="0.85" />
              <path d={`M${x} 28 Q${x - 10} 22 ${x - 14} 28`} stroke="#22c55e" strokeWidth="2" fill="none" strokeOpacity="0.65" />
            </g>
          ))}
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

// /effects/image_animation-inspired Triangle-Mesh Cubic-Bezier Shatter & Flight
const BurnCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.offsetWidth || 640);
    const h = (canvas.height = canvas.offsetHeight || 220);
    const cols = 16;
    const rows = 8;
    const cw = w / cols;
    const ch = h / rows;

    interface TriShard {
      pts: [number, number, number, number, number, number];
      cx: number; cy: number; delay: number; dur: number; tx: number; ty: number; rot: number; color: string;
    }

    const palette = ['#f5f0e8', '#e8dfd3', '#D97757', '#f59e0b', '#cbd5e1', '#94a3b8'];
    const shards: TriShard[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = c * cw, y0 = r * ch, x1 = x0 + cw, y1 = y0 + ch;
        const tris: Array<[number, number, number, number, number, number]> = [
          [x0, y0, x1, y0, x0, y1],
          [x1, y0, x1, y1, x0, y1],
        ];
        tris.forEach((pts, ti) => {
          const cx = (pts[0] + pts[2] + pts[4]) / 3;
          const cy = (pts[1] + pts[3] + pts[5]) / 3;
          const wave = (c / cols) * 0.55 + ((rows - r) / rows) * 0.25;
          shards.push({
            pts, cx, cy,
            delay: wave * 0.55 + Math.random() * 0.14,
            dur: 0.65 + Math.random() * 0.35,
            tx: (Math.random() - 0.35) * 180 + (c / cols) * 90,
            ty: -(70 + Math.random() * 140),
            rot: (Math.random() - 0.5) * Math.PI * 2.4,
            color: palette[(r + c + ti) % palette.length],
          });
        });
      }
    }

    const startTime = performance.now();
    let raf = 0;
    const cubicEase = (t: number) => 1 - Math.pow(1 - t, 3);

    const render = (now: number) => {
      const totalSec = (now - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);
      let anyActive = false;
      for (const s of shards) {
        const local = Math.max(0, Math.min(1, (totalSec - s.delay) / s.dur));
        if (local < 1) anyActive = true;
        const e = cubicEase(local);
        const alpha = local <= 0 ? 0.92 : Math.max(0, 1 - local * 1.15);
        if (alpha <= 0.01) continue;
        const dx = s.tx * e, dy = s.ty * e + 30 * e * e;
        const scale = Math.max(0.15, 1 - 0.72 * e);
        ctx.save();
        ctx.translate(s.cx + dx, s.cy + dy);
        ctx.rotate(s.rot * e);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.moveTo(s.pts[0] - s.cx, s.pts[1] - s.cy);
        ctx.lineTo(s.pts[2] - s.cx, s.pts[3] - s.cy);
        ctx.lineTo(s.pts[4] - s.cx, s.pts[5] - s.cy);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      if (anyActive || totalSec < 1.55) raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-40" />;
};

// /effects/weather_box-faithful Canvas Engine for Right 1/3 of Card
const WeatherBoxCanvas: React.FC<{ weather: WeatherKind }> = ({ weather }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.offsetWidth || 220);
    const h = (canvas.height = canvas.offsetHeight || 200);
    let raf = 0, tick = 0, accumLevel = 0, drainX = 0, draining = false, lightningFlash = 0, scorchAlpha = 0, nextLightningTick = 90;

    const drawCloud = (cx: number, cy: number, color: string, scale = 0.85) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(-16, 5, 9, 0, Math.PI * 2);
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.arc(17, 5, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drops = Array.from({ length: 24 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: -(0.6 + Math.random() * 1.1), vy: 4.5 + Math.random() * 4.5,
      len: 8 + Math.random() * 11, size: 0.8 + Math.random() * 1.1, alpha: 0.35 + Math.random() * 0.5,
    }));
    const splashes: Array<{ x: number; y: number; vx: number; vy: number; r: number; life: number }> = [];
    const flakes = Array.from({ length: 26 }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: 1.3 + Math.random() * 2.8,
      vy: 0.65 + Math.random() * 1.4, phase: Math.random() * Math.PI * 2, alpha: 0.45 + Math.random() * 0.5,
    }));
    const leaves = Array.from({ length: 7 }, () => ({
      x: Math.random() * w, y: Math.random() * h, vx: -(1.6 + Math.random() * 2.5),
      vy: (Math.random() - 0.35) * 1.1, rot: Math.random() * Math.PI * 2, rv: (Math.random() - 0.5) * 0.14,
      s: 0.6 + Math.random() * 0.6, alpha: 0.85,
      fadeAt: (-0.25 + Math.random() * 0.65) * w,
      fadeRate: 0.008 + Math.random() * 0.018,
      color: Math.random() > 0.45 ? '#f59e0b' : '#ea580c',
    }));

    let boltPts: Array<[number, number]> = [];
    const buildBolt = () => {
      const pts: Array<[number, number]> = [[w * 0.58, 22]];
      let cx = w * 0.58, cy = 22;
      while (cy < h - 4) {
        cy += 16 + Math.random() * 18;
        cx += (Math.random() - 0.5) * 26;
        pts.push([Math.max(12, Math.min(w - 12, cx)), Math.min(h, cy)]);
      }
      boltPts = pts;
    };

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, w, h);
      if (weather === 'sunny') {
        const sx = w * 0.72, sy = 30;
        ctx.save(); ctx.translate(sx, sy); ctx.rotate(tick * 0.006);
        for (let i = 0; i < 9; i++) {
          ctx.rotate((Math.PI * 2) / 9);
          const g = ctx.createLinearGradient(0, 0, 0, 95);
          g.addColorStop(0, 'rgba(255, 222, 23, 0.38)');
          g.addColorStop(1, 'rgba(255, 242, 0, 0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.moveTo(-4, 14); ctx.lineTo(4, 14); ctx.lineTo(14, 95); ctx.lineTo(-14, 95); ctx.closePath(); ctx.fill();
        }
        ctx.restore();
        ctx.fillStyle = '#F7ED47'; ctx.beginPath(); ctx.arc(sx, sy, 14, 0, Math.PI * 2); ctx.fill();
      } else if (weather === 'rainy') {
        drawCloud(w * 0.6, 12, 'rgba(148, 163, 184, 0.36)', 0.85);
        if (!draining) {
          accumLevel = Math.min(1, accumLevel + 0.0018);
          if (accumLevel >= 1) draining = true;
        } else {
          drainX += 0.65;
          accumLevel = Math.max(0, accumLevel - 0.0035);
          if (accumLevel <= 0.05) { draining = false; drainX = 0; }
        }
        for (const d of drops) {
          d.x += d.vx; d.y += d.vy;
          if (d.y >= h - 3) {
            for (let k = 0; k < 2; k++) splashes.push({ x: d.x, y: h - 2, vx: (Math.random() - 0.5) * 2.2, vy: -(1.4 + Math.random() * 2.2), r: 1.1 + Math.random() * 1.2, life: 1 });
            d.x = Math.random() * (w + 24); d.y = 14;
          }
          ctx.strokeStyle = `rgba(56, 189, 248, ${d.alpha})`; ctx.lineWidth = d.size;
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.vx * 1.5, d.y - d.len); ctx.stroke();
        }
        for (let i = splashes.length - 1; i >= 0; i--) {
          const sp = splashes[i]; sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.18; sp.life -= 0.06;
          if (sp.life <= 0) { splashes.splice(i, 1); continue; }
          ctx.fillStyle = `rgba(125, 211, 252, ${sp.life})`; ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2); ctx.fill();
        }
        const pw = (0.28 + accumLevel * 0.68) * w, ph = 4 + accumLevel * 12;
        const pg = ctx.createLinearGradient(0, h - ph, 0, h);
        pg.addColorStop(0, 'rgba(125, 211, 252, 0.55)'); pg.addColorStop(1, 'rgba(14, 165, 233, 0.85)');
        ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(w * 0.55 + drainX, h, pw * 0.55, ph, 0, Math.PI, Math.PI * 2); ctx.fill();
      } else if (weather === 'snowy') {
        drawCloud(w * 0.6, 12, 'rgba(203, 213, 225, 0.42)', 0.85);
        // Snow pile builds up and stays accumulated (does NOT disappear)
        accumLevel = Math.min(1, accumLevel + 0.0014);
        for (const f of flakes) {
          f.y += f.vy; f.x += Math.sin(tick * 0.025 + f.phase) * 0.65;
          if (f.y >= h - 3) {
            splashes.push({ x: f.x, y: h - 2, vx: (Math.random() - 0.5) * 1.4, vy: -(0.6 + Math.random() * 1.2), r: 1 + Math.random() * 1.2, life: 1 });
            f.x = Math.random() * w; f.y = 14;
          }
          ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
        }
        for (let i = splashes.length - 1; i >= 0; i--) {
          const sp = splashes[i]; sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.08; sp.life -= 0.05;
          if (sp.life <= 0) { splashes.splice(i, 1); continue; }
          ctx.fillStyle = `rgba(255, 255, 255, ${sp.life})`; ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2); ctx.fill();
        }
        const sw = (0.26 + accumLevel * 0.72) * w, sh = 4 + accumLevel * 14;
        const sg = ctx.createLinearGradient(0, h - sh, 0, h);
        sg.addColorStop(0, 'rgba(255, 255, 255, 0.96)'); sg.addColorStop(1, 'rgba(226, 232, 240, 0.92)');
        ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(w * 0.54, h, sw * 0.56, sh, 0, Math.PI, Math.PI * 2); ctx.fill();
      } else if (weather === 'wind') {
        for (let i = 0; i < 3; i++) {
          const gy = ((tick * 1.5 + i * 55) % (h - 20)) + 10, gx = w - ((tick * 4 + i * 70) % (w + 60));
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.45)'; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + 34, gy - 3); ctx.stroke();
        }
        for (const l of leaves) {
          l.x += l.vx; l.y += l.vy + Math.sin(tick * 0.05 + l.x * 0.04) * 0.6; l.rot += l.rv;
          // Leaves fade out at staggered individual thresholds (allowing crossing past 1/3 boundary)
          if (l.x < l.fadeAt) l.alpha = Math.max(0, l.alpha - l.fadeRate);
          else l.alpha = Math.min(0.9, l.alpha + 0.03);
          if (l.x < -45 || l.alpha <= 0.02) {
            l.x = w + 10; l.y = Math.random() * (h - 20); l.alpha = 0.05;
            l.fadeAt = (-0.25 + Math.random() * 0.65) * w;
          }
          ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.rot); ctx.scale(l.s, l.s);
          ctx.globalAlpha = l.alpha;
          ctx.fillStyle = l.color; ctx.beginPath(); ctx.ellipse(0, 0, 7, 3.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
      } else if (weather === 'thunder') {
        // Soft semi-transparent storm clouds at top (never obscuring buttons)
        const cloudCol = lightningFlash > 0.25 ? 'rgba(148, 163, 184, 0.58)' : 'rgba(100, 116, 139, 0.42)';
        drawCloud(w * 0.46, 11, 'rgba(148, 163, 184, 0.34)', 0.78);
        drawCloud(w * 0.64, 13, cloudCol, 0.92);
        if (tick >= nextLightningTick) { buildBolt(); lightningFlash = 1; scorchAlpha = 0.85; nextLightningTick = tick + 150 + Math.floor(Math.random() * 140); }
        if (lightningFlash > 0.02) {
          ctx.strokeStyle = `rgba(253, 224, 71, ${lightningFlash})`; ctx.lineWidth = 2.6;
          ctx.shadowColor = '#fde047'; ctx.shadowBlur = 12; ctx.beginPath();
          boltPts.forEach(([bx, by], idx) => (idx === 0 ? ctx.moveTo(bx, by) : ctx.lineTo(bx, by)));
          ctx.stroke(); ctx.shadowBlur = 0; lightningFlash *= 0.84;
        }
        if (scorchAlpha > 0.01) {
          const sx = boltPts[boltPts.length - 1]?.[0] || w * 0.58;
          const sg = ctx.createRadialGradient(sx, h, 2, sx, h, 28);
          sg.addColorStop(0, `rgba(12, 12, 14, ${scorchAlpha})`);
          sg.addColorStop(0.55, `rgba(28, 25, 23, ${scorchAlpha * 0.55})`);
          sg.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(sx, h, 28, 12, 0, Math.PI, Math.PI * 2); ctx.fill();
          scorchAlpha *= 0.985;
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [weather]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 w-full h-full" />;
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
  const [avatar, setAvatar] = useState('');
  const [contact, setContact] = useState('');
  const [content, setContent] = useState('');
  const [isBurnMode, setIsBurnMode] = useState(false);
  const [toast, setToast] = useState('');

  const [revealedStartTimes, setRevealedStartTimes] = useState<Record<number, number>>({});
  const [nowTick, setNowTick] = useState<number>(Date.now());
  const [burningIds, setBurningIds] = useState<Record<number, boolean>>({});
  const [bounceIds, setBounceIds] = useState<Record<number, boolean>>({});
  const [likedPulseIds, setLikedPulseIds] = useState<Record<number, boolean>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [cardWeathers, setCardWeathers] = useState<Record<number, WeatherKind>>({});
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyName, setReplyName] = useState('');
  const [replyAvatar, setReplyAvatar] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      setIsAdmin(localStorage.getItem('admin_authenticated') === 'true');
      const savedW = localStorage.getItem('guestbook_card_weathers');
      if (savedW) {
        const pw = JSON.parse(savedW);
        if (pw && typeof pw === 'object') setCardWeathers(pw);
      }
    } catch {}
    const saved = localStorage.getItem('guestbook_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If only old default messages (<= 6) were saved, upgrade to 12-message set
          const isOldDefaultSet = parsed.length <= 6 && parsed.every((m: CommentItem) => m.id <= 6);
          const source = isOldDefaultSet ? initialMessages : parsed;
          const withBiomes = source.map((m: CommentItem, i: number) => ({
            ...m,
            biome: m.biome || ALL_BIOMES[i % ALL_BIOMES.length],
          }));
          setMessages(withBiomes);
        }
      } catch {}
    }

    // Cycle weather states smoothly every 12 seconds
    const wTimer = setInterval(() => {
      setWeatherOffset((prev) => (prev + 1) % 4);
    }, 12000);
    return () => clearInterval(wTimer);
  }, []);

  // Smooth 50ms progress tick so the 5s progress bar reaches 0% cleanly BEFORE burning starts
  useEffect(() => {
    const activeIds = Object.keys(revealedStartTimes).map(Number);
    if (activeIds.length === 0) return;

    const timer = setInterval(() => {
      const now = Date.now();
      setNowTick(now);

      const expired: number[] = [];
      for (const id of activeIds) {
        if (now - revealedStartTimes[id] >= 5080) {
          expired.push(id);
        }
      }

      if (expired.length > 0) {
        setRevealedStartTimes((prev) => {
          const next = { ...prev };
          expired.forEach((id) => delete next[id]);
          return next;
        });
        expired.forEach((id) => triggerBurnAnimation(id));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [revealedStartTimes]);

  const triggerBurnAnimation = (id: number) => {
    setBurningIds((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setMessages((curr) => {
        const idx = curr.findIndex((m) => m.id === id);
        const nextCard = idx >= 0 ? curr[idx + 1] : undefined;
        const updated = curr.filter((m) => m.id !== id);
        localStorage.setItem('guestbook_messages', JSON.stringify(updated));
        if (nextCard) {
          setBounceIds((prev) => ({ ...prev, [nextCard.id]: true }));
          setTimeout(() => {
            setBounceIds((prev) => {
              const copy = { ...prev };
              delete copy[nextCard.id];
              return copy;
            });
          }, 600);
        }
        return updated;
      });
      setBurningIds((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, 1450);
  };

  const revealBurnMessage = (id: number) => {
    if (revealedStartTimes[id] !== undefined || burningIds[id]) return;
    const now = Date.now();
    setNowTick(now);
    setRevealedStartTimes((prev) => ({ ...prev, [id]: now }));
  };

  const handleLike = (id: number) => {
    setLikedPulseIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLikedPulseIds((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 950);
    const updated = messages.map((m) => (m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m));
    setMessages(updated);
    localStorage.setItem('guestbook_messages', JSON.stringify(updated));
  };

  const handleReplySubmit = (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!replyName.trim() || !replyContent.trim()) return;
    const isAdminUser = localStorage.getItem('admin_authenticated') === 'true';
    const newReply: ReplyItem = {
      id: Date.now(),
      name: replyName.trim(),
      avatar: replyAvatar.trim() || undefined,
      content: replyContent.trim(),
      date: new Date().toLocaleDateString('zh-CN'),
      isAdmin: isAdminUser,
    };
    const updated = messages.map((m) =>
      m.id === parentId ? { ...m, replies: [...(m.replies || []), newReply] } : m
    );
    setMessages(updated);
    localStorage.setItem('guestbook_messages', JSON.stringify(updated));
    setReplyName('');
    setReplyAvatar('');
    setReplyContent('');
    setReplyingToId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const isAdminUser = localStorage.getItem('admin_authenticated') === 'true';

    const newMsg: CommentItem = {
      id: Date.now(),
      name: name.trim(),
      avatar: avatar.trim() || undefined,
      contact: contact.trim(),
      content: content.trim(),
      date: new Date().toLocaleDateString('zh-CN'),
      isAdmin: isAdminUser,
      isBurnAfterReading: isBurnMode,
      likes: 0,
      biome: ALL_BIOMES[Math.floor(Math.random() * ALL_BIOMES.length)],
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem('guestbook_messages', JSON.stringify(updated));

    setName('');
    setAvatar('');
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="您的昵称 *"
            required
            className="w-full px-3.5 py-2.5 rounded-xl glass text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta/50"
          />
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="头像链接 https://... (可选)"
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
          0%, 15% { left: -16%; opacity: 0; }
          25% { opacity: 0.95; }
          85% { opacity: 0.95; }
          100% { left: 108%; opacity: 0; }
        }
        .tw-sandstorm-gust {
          animation: sandstormSweep 14s linear infinite;
        }
        @keyframes weatherRain {
          0% { transform: translateY(-10px); opacity: 0; }
          30% { opacity: 0.75; }
          100% { transform: translateY(75px); opacity: 0; }
        }
        .tw-raindrop {
          animation: weatherRain 1.4s linear infinite;
        }
        @keyframes weatherSnow {
          0% { transform: translateY(-8px) translateX(0); opacity: 0; }
          30% { opacity: 0.85; }
          100% { transform: translateY(72px) translateX(10px); opacity: 0; }
        }
        .tw-snowflake {
          animation: weatherSnow 3.2s ease-in-out infinite;
        }
        @keyframes rainPuddleGrow {
          0%, 10% { height: 4px; opacity: 0.45; }
          65% { height: 15px; opacity: 0.85; }
          90% { height: 15px; opacity: 0.75; }
          100% { height: 4px; opacity: 0.45; }
        }
        .tw-rain-puddle {
          animation: rainPuddleGrow 12s ease-in-out infinite;
        }
        @keyframes snowPileGrow {
          0%, 10% { height: 4px; opacity: 0.55; }
          70% { height: 18px; opacity: 0.95; }
          92% { height: 18px; opacity: 0.85; }
          100% { height: 4px; opacity: 0.55; }
        }
        .tw-snow-pile {
          animation: snowPileGrow 14s ease-in-out infinite;
        }
        @keyframes lightningStrike {
          0%, 10%, 18%, 100% { opacity: 0; }
          12% { opacity: 1; }
          14% { opacity: 0.2; }
          16% { opacity: 0.95; }
        }
        .tw-lightning-bolt {
          animation: lightningStrike 7s linear infinite;
        }
        @keyframes windLeafFly {
          0% { transform: translate(-20px, 8px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { transform: translate(110px, -18px) rotate(240deg); opacity: 0; }
        }
        .tw-wind-leaf {
          animation: windLeafFly 2.8s ease-in-out infinite;
        }
        @keyframes windStreak {
          0% { transform: translateX(-30px); opacity: 0; }
          30%, 70% { opacity: 0.7; }
          100% { transform: translateX(90px); opacity: 0; }
        }
        .tw-wind-streak {
          animation: windStreak 1.8s linear infinite;
        }
        @keyframes thunderCharRecover {
          0%, 11% { opacity: 0; }
          14%, 22% { opacity: 0.85; }
          78% { opacity: 0.22; }
          100% { opacity: 0; }
        }
        .tw-thunder-char {
          animation: thunderCharRecover 7s ease-out infinite;
        }
        @keyframes facePop {
          0% { transform: scale(1); }
          40% { transform: scale(1.38) rotate(-8deg); }
          70% { transform: scale(0.92) rotate(6deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .tw-face-btn:active svg {
          animation: facePop 0.35s ease-out;
        }
        /* /effects/heart_like bubble + 14 HSL sparkles animation */
        .tw-heart-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .tw-heart-wrap:before,
        .tw-heart-wrap:after {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          content: '';
          pointer-events: none;
        }
        .tw-heart-wrap:before {
          margin: -1.1rem;
          width: 2.2rem;
          height: 2.2rem;
          border: solid 1.1rem #e2264d;
          transform: scale(0);
          box-sizing: border-box;
        }
        .tw-heart-wrap:after {
          margin: -0.1rem;
          width: 0.2rem;
          height: 0.2rem;
          opacity: 0;
        }
        .tw-heart-wrap.is-burst {
          animation: twHeartPop 0.85s cubic-bezier(0.17, 0.89, 0.32, 1.49);
        }
        .tw-heart-wrap.is-burst:before {
          animation: twHeartBubble 0.85s ease-out;
        }
        .tw-heart-wrap.is-burst:after {
          animation: twHeartSparkles 0.85s ease-out;
        }
        @keyframes twHeartPop {
          0% { transform: scale(0.4); }
          50% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        @keyframes twHeartBubble {
          15% { transform: scale(1); border-color: #cc8ef5; border-width: 1.1rem; }
          35%, 100% { transform: scale(1); border-color: #cc8ef5; border-width: 0; }
        }
        @keyframes twHeartSparkles {
          0%, 15% { opacity: 0; box-shadow: 0.16rem -1.3rem 0 -0.1rem hsl(0,100%,75%), -0.16rem -1.5rem 0 -0.1rem hsl(51,100%,75%), 1.2rem -0.7rem 0 -0.1rem hsl(103,100%,75%), 1.3rem 0.45rem 0 -0.1rem hsl(154,100%,75%), 0.45rem 1.3rem 0 -0.1rem hsl(206,100%,75%), -0.75rem 1.15rem 0 -0.1rem hsl(257,100%,75%), -1.35rem 0.15rem 0 -0.1rem hsl(309,100%,75%), -1rem -1rem 0 -0.1rem hsl(350,100%,75%); }
          35% { opacity: 1; box-shadow: 0.16rem -1.05rem 0 0 hsl(0,100%,75%), -0.16rem -1.2rem 0 0 hsl(51,100%,75%), 1rem -0.55rem 0 0 hsl(103,100%,75%), 1.05rem 0.4rem 0 0 hsl(154,100%,75%), 0.35rem 1.05rem 0 0 hsl(206,100%,75%), -0.6rem 0.92rem 0 0 hsl(257,100%,75%), -1.12rem 0.08rem 0 0 hsl(309,100%,75%), -0.82rem -0.85rem 0 0 hsl(350,100%,75%); }
          100% { opacity: 0; }
        }
      `}</style>

      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-mono text-charcoal-100 dark:text-cream-400">
          共 {messages.length} 条留言（每张卡片右侧可独立切换晴/雨/雪/风/雷）
        </span>
      </div>

      {/* Cards List */}
      <div className="space-y-5">
        <AnimatePresence>
          {messages.map((msg, idx) => {
            const startTime = revealedStartTimes[msg.id];
            const isRevealed = startTime !== undefined;
            const elapsedMs = isRevealed ? Math.max(0, nowTick - startTime) : 0;
            const remainingPct = Math.max(0, 100 - (elapsedMs / 5000) * 100);
            const countdown = Math.max(0, Math.ceil((5000 - elapsedMs) / 1000));
            const isBurning = !!burningIds[msg.id];
            const biomeKind: BiomeKind = msg.biome || ALL_BIOMES[idx % ALL_BIOMES.length];
            const biomeStyles: Record<BiomeKind, string> = {
              meadow: 'border-2 border-emerald-500/45 shadow-[inset_0_0_0_2px_rgba(16,185,129,0.14)] bg-white/85 dark:bg-zinc-900/75',
              desert: 'border-2 border-amber-500/45 shadow-[inset_0_0_0_2px_rgba(245,158,11,0.14)] bg-white/85 dark:bg-zinc-900/75',
              stone: 'border-2 border-slate-400/50 shadow-[inset_0_0_0_2px_rgba(148,163,184,0.20)] bg-white/85 dark:bg-zinc-900/75',
              mountain: 'border-2 border-indigo-400/45 shadow-[inset_0_0_0_2px_rgba(129,140,248,0.14)] bg-white/85 dark:bg-zinc-900/75',
              cornfield: 'border-2 border-lime-500/45 shadow-[inset_0_0_0_2px_rgba(132,204,22,0.14)] bg-white/85 dark:bg-zinc-900/75',
              coast: 'border-2 border-sky-400/45 shadow-[inset_0_0_0_2px_rgba(56,189,248,0.14)] bg-white/85 dark:bg-zinc-900/75',
            };
            const weathers: WeatherKind[] = ['sunny', 'rainy', 'snowy', 'wind', 'thunder'];
            const weather: WeatherKind = cardWeathers[msg.id] || weathers[msg.id % weathers.length];
            const setCardWeather = (w: WeatherKind) => {
              setCardWeathers((prev) => {
                const next = { ...prev, [msg.id]: w };
                try { localStorage.setItem('guestbook_card_weathers', JSON.stringify(next)); } catch {}
                return next;
              });
            };

            return (
              <div key={msg.id} className="relative group/msgrow">
                {/* Weather Icon Switcher OUTSIDE card in right blank area (hover row to reveal) */}
                <div className="hidden md:flex flex-col gap-1.5 absolute -right-11 top-3 opacity-0 group-hover/msgrow:opacity-100 transition-opacity duration-200 z-30">
                  {([
                    ['sunny', '晴'],
                    ['rainy', '雨'],
                    ['snowy', '雪'],
                    ['wind', '风'],
                    ['thunder', '雷'],
                  ] as const).map(([wKey, title]) => (
                    <button
                      key={wKey}
                      type="button"
                      onClick={() => setCardWeather(wKey)}
                      title={`切换天气：${title}`}
                      className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                        weather === wKey
                          ? 'bg-slate-900/90 border-amber-400/70 text-white shadow-md scale-110'
                          : 'bg-slate-900/55 border-white/15 text-white/80 hover:bg-slate-900/85 hover:scale-105'
                      }`}
                    >
                      {wKey === 'sunny' && (
                        <svg className="w-4 h-4 text-amber-400 animate-[spin_10s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
                          <path strokeLinecap="round" d="M12 2.5v2M12 19.5v2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M2.5 12h2M19.5 12h2M5.2 18.8l1.4-1.4M17.4 6.6l1.4-1.4" />
                        </svg>
                      )}
                      {wKey === 'rainy' && (
                        <svg className="w-4 h-4 text-sky-300 overflow-visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 14a4 4 0 0 1 0-8 5 5 0 0 1 9.5-1A3.5 3.5 0 0 1 18 14H7z" fill="currentColor" fillOpacity="0.25" />
                          <path className="animate-pulse" strokeLinecap="round" d="M9 17l-1 3" />
                          <path className="animate-bounce" strokeLinecap="round" d="M13 17l-1 3" />
                          <path className="animate-pulse" strokeLinecap="round" d="M17 17l-1 3" />
                        </svg>
                      )}
                      {wKey === 'snowy' && (
                        <svg className="w-4 h-4 text-white overflow-visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 14a4 4 0 0 1 0-8 5 5 0 0 1 9.5-1A3.5 3.5 0 0 1 18 14H7z" fill="currentColor" fillOpacity="0.25" />
                          <circle className="animate-ping" cx="9" cy="18.5" r="1" fill="currentColor" stroke="none" />
                          <circle className="animate-bounce" cx="13" cy="20" r="1.1" fill="currentColor" stroke="none" />
                          <circle className="animate-pulse" cx="16.5" cy="18.5" r="1" fill="currentColor" stroke="none" />
                        </svg>
                      )}
                      {wKey === 'wind' && (
                        <svg className="w-4 h-4 text-teal-300 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M4 9h11a2.5 2.5 0 1 0-2.5-2.5M3 13h14a2.5 2.5 0 1 1-2.5 2.5M6 17h6" />
                        </svg>
                      )}
                      {wKey === 'thunder' && (
                        <svg className="w-4 h-4 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 13a4 4 0 0 1 0-8 5 5 0 0 1 9.5-1A3.5 3.5 0 0 1 18 13H7z" fillOpacity="0.35" />
                          <polygon className="animate-pulse" points="13,11 9,17 12,17 10.5,22 16,15 13,15" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={
                  isBurning
                    ? { opacity: 0.25, scale: 0.96 }
                    : bounceIds[msg.id]
                    ? { y: [18, -7, 3, 0], opacity: 1, scale: 1 }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.38, ease: 'easeOut' }}
                className={`relative rounded-2xl p-6 sm:p-7 pb-12 sm:pb-14 transition-colors overflow-hidden ${biomeStyles[biomeKind]}`}
              >
                <BiomeDecoration biome={biomeKind} />
                {/* Right 1/3 Weather Effect Overlay (faithful /effects/weather_box Canvas engine) */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 z-20 overflow-hidden" aria-hidden="true">
                  <WeatherBoxCanvas weather={weather} />
                </div>
                {isBurning && <BurnCanvas />}

                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                      {msg.avatar ? (
                        <img src={msg.avatar} alt={msg.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )}
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

                  <div className="flex items-center gap-2 text-[11px] font-mono text-charcoal-100 dark:text-cream-400">
                    <span className="flex items-center gap-1 mr-1">
                      <Calendar className="w-3 h-3" /> {msg.date}
                    </span>
                    <button
                      onClick={() => setReplyingToId(replyingToId === msg.id ? null : msg.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-terracotta/10 text-terracotta transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>回复</span>
                    </button>
                    <button
                      onClick={() => handleLike(msg.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-rose-500/10 text-rose-500 transition-colors"
                    >
                      <span className={`tw-heart-wrap ${likedPulseIds[msg.id] ? 'is-burst text-[#e2264d]' : ''}`}>
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </span>
                      <span>{msg.likes || 0}</span>
                    </button>
                    {isAdmin && (
                      confirmDeleteId === msg.id ? (
                        <span className="inline-flex items-center gap-1">
                          <button
                            onClick={() => {
                              setMessages((prev) => {
                                const updated = prev.filter((m) => m.id !== msg.id);
                                localStorage.setItem('guestbook_messages', JSON.stringify(updated));
                                return updated;
                              });
                              setConfirmDeleteId(null);
                              setToast('🗑️ 管理员已确认删除该条留言');
                              setTimeout(() => setToast(''), 2500);
                            }}
                            className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] hover:bg-red-600 transition-colors"
                          >
                            确认删除
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[10px] hover:opacity-80"
                          >
                            取消
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(msg.id)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-red-500/15 text-red-500 transition-colors"
                          title="仅管理员可见：删除此条留言"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>删除</span>
                        </button>
                      )
                    )}
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
                          className="h-full bg-gradient-to-r from-[#DDAD95] via-orange-500 to-rose-500"
                          style={{ width: `${remainingPct}%` }}
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

                {/* Nested Interactive Replies */}
                {msg.replies && msg.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-terracotta/25 space-y-2.5">
                    {msg.replies.map((rep) => (
                      <div key={rep.id} className="rounded-xl bg-black/4 dark:bg-white/5 px-3.5 py-2.5 text-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-charcoal-DEFAULT dark:text-cream-50">{rep.name}</span>
                            {rep.isAdmin && (
                              <span className="px-1.5 py-0.5 rounded-full bg-terracotta text-white text-[9px] font-mono">站长</span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-charcoal-100 dark:text-cream-400">{rep.date}</span>
                        </div>
                        <p className="text-charcoal-200 dark:text-cream-200 leading-relaxed">{rep.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Reply Form */}
                {replyingToId === msg.id && (
                  <form onSubmit={(e) => handleReplySubmit(e, msg.id)} className="mt-4 pt-3 border-t border-black/8 dark:border-white/10 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={replyName}
                      onChange={(e) => setReplyName(e.target.value)}
                      placeholder="你的昵称 *"
                      required
                      className="sm:w-32 px-3 py-1.5 rounded-xl glass text-xs text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta"
                    />
                    <input
                      type="url"
                      value={replyAvatar}
                      onChange={(e) => setReplyAvatar(e.target.value)}
                      placeholder="头像链接 (可选)"
                      className="sm:w-36 px-3 py-1.5 rounded-xl glass text-xs text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta"
                    />
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`回复 @${msg.name}...`}
                      required
                      className="flex-1 px-3 py-1.5 rounded-xl glass text-xs text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-terracotta text-white text-xs font-mono font-semibold hover:bg-terracotta/90 transition-colors shrink-0"
                    >
                      发送回复
                    </button>
                  </form>
                )}
              </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
