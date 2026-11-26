import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

type ShellStyle = 'chrysanthemum' | 'ring' | 'willow' | 'strobe' | 'pistil';

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

const COLORS = ['#FF5E7E', '#FFD166', '#06D6A0', '#4EA8DE', '#C77DFF', '#FF9F1C', '#F8FAFC', '#FF3366'];
const SHELL_STYLES: ShellStyle[] = ['chrysanthemum', 'ring', 'willow', 'strobe', 'pistil'];

const playSound = (src: string, volume = 0.35) => {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {}
};

export const FireworksOverlay: React.FC = () => {
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

      {/* Early Close Button when fireworks mask is active */}
      {isDarkMask && (
        <button
          onClick={stopFireworks}
          className="fixed top-20 right-6 z-50 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-mono shadow-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>关闭烟花</span>
        </button>
      )}

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      <button
        onClick={launchFireworks}
        style={{ top: btnPos.top, left: btnPos.left }}
        className="absolute z-30 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/45 hover:bg-black/70 border border-white/25 text-white text-xs font-mono shadow-xl transition-transform hover:scale-105 active:scale-95"
        title="点击熄灯放烟花（点击夜空可连放）"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>🎆 放个烟花</span>
      </button>
    </>
  );
};
