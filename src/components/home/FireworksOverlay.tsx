import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

type ShellStyle =
  | 'chrysanthemum'
  | 'ring'
  | 'willow'
  | 'strobe'
  | 'pistil'
  | 'heart'
  | 'star'
  | 'doubleRing'
  | 'spiral'
  | 'crossette';

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  secondaryColor: string;
  shellStyle: ShellStyle;
  trail: Array<{ x: number; y: number }>;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  gravity: number;
  drag: number;
  flicker: boolean;
  prevX: number;
  prevY: number;
}

const COLORS = ['#FF5E7E', '#FFD166', '#06D6A0', '#4EA8DE', '#C77DFF', '#FF9F1C', '#F8FAFC', '#FF3366', '#38BDF8', '#A3E635'];
const SHELL_STYLES: ShellStyle[] = [
  'chrysanthemum',
  'ring',
  'willow',
  'strobe',
  'pistil',
  'heart',
  'star',
  'doubleRing',
  'spiral',
  'crossette',
];

const playSound = (src: string, volume = 0.35) => {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {}
};

export const FireworksOverlay: React.FC<{ inlineTrigger?: boolean }> = ({ inlineTrigger = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const closeTimeoutRef = useRef<number | null>(null);

  const [isDarkMask, setIsDarkMask] = useState(false);
  const [btnPos, setBtnPos] = useState<{ top: string; left: string }>({ top: '76%', left: '14%' });

  useEffect(() => {
    const top = Math.round(18 + Math.random() * 62);
    const left = Math.round(10 + Math.random() * 72);
    setBtnPos({ top: `${top}%`, left: `${left}%` });
    return () => stopFireworks();
  }, []);

  const stopFireworks = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rocketsRef.current = [];
    sparksRef.current = [];
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsDarkMask(false);
  };

  const explodeRocket = (r: Rocket) => {
    const burstSound =
      Math.random() > 0.5
        ? '/effects/fireworks/fire_voice/burst1.mp3'
        : '/effects/fireworks/fire_voice/burst2.mp3';
    playSound(burstSound, 0.42);
    if (r.shellStyle === 'strobe' || r.shellStyle === 'chrysanthemum') {
      const tid = window.setTimeout(() => playSound('/effects/fireworks/fire_voice/crackle-sm-1.mp3', 0.28), 160);
      timeoutsRef.current.push(tid);
    }

    const { x: rx, y: ry, color: baseColor, secondaryColor, shellStyle } = r;

    if (shellStyle === 'ring') {
      const count = 56;
      const ringSpeed = 7.2 + Math.random() * 2.0;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * ringSpeed,
          vy: Math.sin(angle) * ringSpeed,
          alpha: 1, color: baseColor, size: 2.5, decay: 0.024,
          gravity: 0.11, drag: 0.955, flicker: false,
        });
      }
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 2.8;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1, color: secondaryColor, size: 2.0, decay: 0.028,
          gravity: 0.12, drag: 0.95, flicker: true,
        });
      }
    } else if (shellStyle === 'willow') {
      const count = 64;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.4 + Math.random() * 6.4;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1, color: '#FFD166', size: 2.0, decay: 0.017,
          gravity: 0.16, drag: 0.95, flicker: true,
        });
      }
    } else if (shellStyle === 'pistil') {
      for (let i = 0; i < 60; i++) {
        const angle = (Math.PI * 2 * i) / 60;
        const speed = 7.4 + Math.random() * 1.6;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1, color: baseColor, size: 2.3, decay: 0.023,
          gravity: 0.12, drag: 0.955, flicker: false,
        });
      }
      for (let i = 0; i < 32; i++) {
        const angle = (Math.PI * 2 * i) / 32;
        const speed = 3.6 + Math.random() * 1.1;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1, color: secondaryColor, size: 2.0, decay: 0.028,
          gravity: 0.11, drag: 0.95, flicker: true,
        });
      }
    } else if (shellStyle === 'strobe') {
      const count = 72;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 8.2;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.5 ? '#FFFFFF' : baseColor,
          size: Math.random() * 2.4 + 1.5,
          decay: 0.021 + Math.random() * 0.012,
          gravity: 0.12, drag: 0.95, flicker: true,
        });
      }
    } else if (shellStyle === 'heart') {
      const count = 64;
      for (let i = 0; i < count; i++) {
        const t = (Math.PI * 2 * i) / count;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: hx * 0.36, vy: hy * 0.36,
          alpha: 1, color: '#FF5E7E', size: 2.5, decay: 0.02,
          gravity: 0.08, drag: 0.955, flicker: true,
        });
      }
    } else if (shellStyle === 'star') {
      const points = 5;
      for (let i = 0; i < 65; i++) {
        const angle = (Math.PI * 2 * i) / 65;
        const starR = 4.2 + 3.4 * Math.abs(Math.cos((angle * points) / 2));
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * starR, vy: Math.sin(angle) * starR,
          alpha: 1, color: i % 2 === 0 ? '#FFD166' : baseColor, size: 2.4, decay: 0.021,
          gravity: 0.1, drag: 0.955, flicker: false,
        });
      }
    } else if (shellStyle === 'doubleRing') {
      [4.5, 8.2].forEach((spd, ringIdx) => {
        for (let i = 0; i < 44; i++) {
          const angle = (Math.PI * 2 * i) / 44;
          sparksRef.current.push({
            x: rx, y: ry, prevX: rx, prevY: ry,
            vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
            alpha: 1, color: ringIdx === 0 ? secondaryColor : baseColor, size: 2.2, decay: 0.022,
            gravity: 0.1, drag: 0.955, flicker: ringIdx === 0,
          });
        }
      });
    } else if (shellStyle === 'spiral') {
      for (let i = 0; i < 72; i++) {
        const angle = i * 0.34;
        const speed = 1.8 + (i / 72) * 7.6;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          alpha: 1, color: COLORS[i % COLORS.length], size: 2.2, decay: 0.02,
          gravity: 0.09, drag: 0.955, flicker: true,
        });
      }
    } else if (shellStyle === 'crossette') {
      for (let arm = 0; arm < 8; arm++) {
        const baseA = (Math.PI * 2 * arm) / 8;
        const col = COLORS[(arm + Math.floor(Math.random() * 4)) % COLORS.length];
        for (let s = 0; s < 8; s++) {
          const spread = baseA + (Math.random() - 0.5) * 0.25;
          const spd = 4.2 + s * 0.7;
          sparksRef.current.push({
            x: rx, y: ry, prevX: rx, prevY: ry,
            vx: Math.cos(spread) * spd, vy: Math.sin(spread) * spd,
            alpha: 1, color: col, size: 2.4, decay: 0.02,
            gravity: 0.13, drag: 0.95, flicker: true,
          });
        }
      }
    } else {
      const count = 68;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.14;
        const speed = 3.0 + Math.random() * 7.5;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.25 ? baseColor : secondaryColor,
          size: Math.random() * 2.1 + 1.5,
          decay: 0.022 + Math.random() * 0.01,
          gravity: 0.13, drag: 0.955, flicker: false,
        });
      }
    }
  };

  const startLoop = () => {
    if (rafRef.current !== null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { desynchronized: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const tick = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.30)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 6) r.trail.shift();

        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.16;

        ctx.beginPath();
        if (r.trail.length > 1) {
          ctx.moveTo(r.trail[0].x, r.trail[0].y);
          for (const pt of r.trail) ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.6;
        ctx.stroke();

        if (r.y <= r.targetY || r.vy >= -0.8) {
          explodeRocket(r);
          rockets.splice(i, 1);
        }
      }

      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.prevX = s.x;
        s.prevY = s.y;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.vx *= s.drag;
        s.vy *= s.drag;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        const drawAlpha = s.flicker ? s.alpha * (0.45 + Math.random() * 0.55) : s.alpha;
        ctx.globalAlpha = Math.max(0, drawAlpha);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.prevX, s.prevY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      if (rockets.length > 0 || sparks.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (shellStyle === 'heart') {
      const count = 64;
      for (let i = 0; i < count; i++) {
        const t = (Math.PI * 2 * i) / count;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: hx * 0.36, vy: hy * 0.36,
          alpha: 1, color: '#FF5E7E', size: 2.5, decay: 0.02,
          gravity: 0.08, drag: 0.955, flicker: true,
        });
      }
    } else if (shellStyle === 'star') {
      const points = 5;
      for (let i = 0; i < 65; i++) {
        const angle = (Math.PI * 2 * i) / 65;
        const starR = 4.2 + 3.4 * Math.abs(Math.cos((angle * points) / 2));
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * starR, vy: Math.sin(angle) * starR,
          alpha: 1, color: i % 2 === 0 ? '#FFD166' : baseColor, size: 2.4, decay: 0.021,
          gravity: 0.1, drag: 0.955, flicker: false,
        });
      }
    } else if (shellStyle === 'doubleRing') {
      [4.5, 8.2].forEach((spd, ringIdx) => {
        for (let i = 0; i < 44; i++) {
          const angle = (Math.PI * 2 * i) / 44;
          sparksRef.current.push({
            x: rx, y: ry, prevX: rx, prevY: ry,
            vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
            alpha: 1, color: ringIdx === 0 ? secondaryColor : baseColor, size: 2.2, decay: 0.022,
            gravity: 0.1, drag: 0.955, flicker: ringIdx === 0,
          });
        }
      });
    } else if (shellStyle === 'spiral') {
      for (let i = 0; i < 72; i++) {
        const angle = i * 0.34;
        const speed = 1.8 + (i / 72) * 7.6;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          alpha: 1, color: COLORS[i % COLORS.length], size: 2.2, decay: 0.02,
          gravity: 0.09, drag: 0.955, flicker: true,
        });
      }
    } else if (shellStyle === 'crossette') {
      for (let arm = 0; arm < 8; arm++) {
        const baseA = (Math.PI * 2 * arm) / 8;
        const col = COLORS[(arm + Math.floor(Math.random() * 4)) % COLORS.length];
        for (let s = 0; s < 8; s++) {
          const spread = baseA + (Math.random() - 0.5) * 0.25;
          const spd = 4.2 + s * 0.7;
          sparksRef.current.push({
            x: rx, y: ry, prevX: rx, prevY: ry,
            vx: Math.cos(spread) * spd, vy: Math.sin(spread) * spd,
            alpha: 1, color: col, size: 2.4, decay: 0.02,
            gravity: 0.13, drag: 0.95, flicker: true,
          });
        }
      }
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafRef.current = null;
        if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = window.setTimeout(() => {
          setIsDarkMask(false);
        }, 500);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const spawnRocket = (targetX?: number, targetY?: number) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    const liftNum = 1 + Math.floor(Math.random() * 3);
    playSound(`/effects/fireworks/fire_voice/lift${liftNum}.mp3`, 0.34);

    const startX = targetX !== undefined ? targetX + (Math.random() - 0.5) * 40 : w * (0.2 + Math.random() * 0.6);
    const goalY = targetY !== undefined ? Math.min(h * 0.65, Math.max(h * 0.12, targetY)) : h * (0.16 + Math.random() * 0.25);

    rocketsRef.current.push({
      x: startX,
      y: h * 0.96,
      vx: targetX !== undefined ? (targetX - startX) * 0.02 : (Math.random() - 0.5) * 2.2,
      vy: -(14.5 + Math.random() * 3.5),
      targetY: goalY,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      secondaryColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      shellStyle: SHELL_STYLES[Math.floor(Math.random() * SHELL_STYLES.length)],
      trail: [],
    });

    startLoop();
  };

  const launchFireworks = () => {
    setIsDarkMask(true);
    const count = 1 + Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i++) {
      const tid = window.setTimeout(() => {
        spawnRocket();
      }, 220 + i * 320);
      timeoutsRef.current.push(tid);
    }
  };

  return (
    <>
      {/* Clickable dark mask: clicking anywhere launches another firework! */}
      <div
        onClick={(e) => {
          if (isDarkMask) spawnRocket(e.clientX, e.clientY);
        }}
        className={`fixed inset-0 bg-black/85 z-40 transition-opacity duration-500 ${
          isDarkMask ? 'opacity-100 pointer-events-auto cursor-crosshair' : 'opacity-0 pointer-events-none'
        }`}
        title={isDarkMask ? '点击夜空任意位置继续放烟花' : undefined}
      />

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* Merged Morphing Launch / Close Fireworks Button */}
      <button
        onClick={isDarkMask ? stopFireworks : launchFireworks}
        style={inlineTrigger ? undefined : { top: btnPos.top, left: btnPos.left }}
        className={
          inlineTrigger
            ? `group relative z-50 inline-flex items-center h-10 px-3 rounded-full backdrop-blur-md border text-white transition-all duration-300 shadow-lg overflow-hidden ${
                isDarkMask
                  ? 'bg-rose-500/80 hover:bg-rose-500 border-rose-300/60 scale-105 shadow-rose-500/30'
                  : 'bg-black/35 hover:bg-black/60 border-white/25'
              }`
            : `z-50 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-white text-xs font-mono shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                isDarkMask
                  ? 'fixed top-20 right-6 bg-rose-500/85 hover:bg-rose-500 border-rose-300/60'
                  : 'absolute bg-black/45 hover:bg-black/70 border-white/25'
              }`
        }
        title={isDarkMask ? '点击关闭烟花' : '点击熄灯放烟花（点击夜空可连放）'}
      >
        <span className={`relative w-4 h-4 shrink-0 flex items-center justify-center transition-transform duration-300 ${isDarkMask ? 'rotate-90' : 'rotate-0'}`}>
          {isDarkMask ? (
            <X className="w-4 h-4 text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
        </span>
        <span
          className={
            inlineTrigger
              ? `${isDarkMask ? 'max-w-[90px] ml-2' : 'max-w-0 group-hover:max-w-[90px] group-hover:ml-2'} overflow-hidden whitespace-nowrap text-xs font-mono transition-all duration-300`
              : ''
          }
        >
          {isDarkMask ? '关闭烟花' : inlineTrigger ? '放个烟花' : '🎆 放个烟花'}
        </span>
      </button>
    </>
  );
};
