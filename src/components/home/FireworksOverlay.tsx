import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

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

const playSound = (src: string, volume = 0.45) => {
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

  const [isDarkMask, setIsDarkMask] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [btnPos, setBtnPos] = useState<{ top: string; left: string }>({ top: '76%', left: '14%' });

  useEffect(() => {
    const top = Math.round(18 + Math.random() * 62);
    const left = Math.round(10 + Math.random() * 72);
    setBtnPos({ top: `${top}%`, left: `${left}%` });
  }, []);

  const explodeRocket = (r: Rocket) => {
    const burstSound =
      Math.random() > 0.5
        ? '/effects/fireworks/fire_voice/burst1.mp3'
        : '/effects/fireworks/fire_voice/burst2.mp3';
    playSound(burstSound, 0.5);
    if (r.shellStyle === 'strobe' || r.shellStyle === 'chrysanthemum') {
      setTimeout(() => playSound('/effects/fireworks/fire_voice/crackle-sm-1.mp3', 0.35), 240);
    }

    const { x: rx, y: ry, color: baseColor, secondaryColor, shellStyle } = r;

    if (shellStyle === 'ring') {
      // Hollow crisp ring + tiny center core
      const count = 72;
      const ringSpeed = 4.8 + Math.random() * 1.4;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * ringSpeed,
          vy: Math.sin(angle) * ringSpeed,
          alpha: 1, color: baseColor, size: 2.4, decay: 0.014,
          gravity: 0.04, drag: 0.98, flicker: false,
        });
      }
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.2;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1, color: secondaryColor, size: 1.8, decay: 0.018,
          gravity: 0.05, drag: 0.97, flicker: true,
        });
      }
    } else if (shellStyle === 'willow') {
      // Golden slow-falling weeping willow trails
      const count = 85;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.4 + Math.random() * 4.5;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1, color: '#FFD166', size: 1.8, decay: 0.0075,
          gravity: 0.095, drag: 0.965, flicker: true,
        });
      }
    } else if (shellStyle === 'pistil') {
      // Double concentric layers (outer + inner contrasting core)
      for (let i = 0; i < 80; i++) {
        const angle = (Math.PI * 2 * i) / 80;
        const speed = 5.2 + Math.random() * 1.2;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1, color: baseColor, size: 2.2, decay: 0.012,
          gravity: 0.06, drag: 0.975, flicker: false,
        });
      }
      for (let i = 0; i < 45; i++) {
        const angle = (Math.PI * 2 * i) / 45;
        const speed = 2.4 + Math.random() * 0.8;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1, color: secondaryColor, size: 2.0, decay: 0.015,
          gravity: 0.05, drag: 0.97, flicker: true,
        });
      }
    } else if (shellStyle === 'strobe') {
      // High-energy glittering strobe stars
      const count = 110;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 6.5;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.5 ? '#FFFFFF' : baseColor,
          size: Math.random() * 2.4 + 1.4,
          decay: 0.011 + Math.random() * 0.01,
          gravity: 0.06, drag: 0.97, flicker: true,
        });
      }
    } else {
      // Classic chrysanthemum
      const count = 95;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.14;
        const speed = 2.0 + Math.random() * 5.8;
        sparksRef.current.push({
          x: rx, y: ry, prevX: rx, prevY: ry,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.25 ? baseColor : secondaryColor,
          size: Math.random() * 2 + 1.4,
          decay: 0.011 + Math.random() * 0.009,
          gravity: 0.075, drag: 0.975, flicker: false,
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
      ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 7) r.trail.shift();

        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.065;

        ctx.beginPath();
        if (r.trail.length > 1) {
          ctx.moveTo(r.trail[0].x, r.trail[0].y);
          for (const pt of r.trail) ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (r.y <= r.targetY || r.vy >= -0.5) {
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
        setTimeout(() => {
          setIsDarkMask(false);
          setIsLaunching(false);
        }, 450);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const launchFireworks = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setIsDarkMask(true);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const count = 1 + Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const liftNum = (i % 3) + 1;
        playSound(`/effects/fireworks/fire_voice/lift${liftNum}.mp3`, 0.4);

        const c1 = COLORS[Math.floor(Math.random() * COLORS.length)];
        const c2 = COLORS[Math.floor(Math.random() * COLORS.length)];
        const style = SHELL_STYLES[Math.floor(Math.random() * SHELL_STYLES.length)];

        rocketsRef.current.push({
          x: w * (0.22 + Math.random() * 0.56),
          y: h * 0.96,
          vx: (Math.random() - 0.5) * 1.8,
          vy: -(9.5 + Math.random() * 3.5),
          targetY: h * (0.18 + Math.random() * 0.25),
          color: c1,
          secondaryColor: c2,
          shellStyle: style,
          trail: [],
        });

        startLoop();
      }, 550 + i * 520);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/85 pointer-events-none z-40 transition-opacity duration-700 ${
          isDarkMask ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
      <button
        onClick={launchFireworks}
        disabled={isLaunching}
        style={{ top: btnPos.top, left: btnPos.left }}
        className="absolute z-30 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-md border border-white/25 text-white text-xs font-mono shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        title="点击熄灯放 1-3 个随机花型烟花（带音效）"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>🎆 放个烟花</span>
      </button>
    </>
  );
};
