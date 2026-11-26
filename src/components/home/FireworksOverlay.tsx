import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
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
  flicker: boolean;
  prevX: number;
  prevY: number;
}

const COLORS = ['#FF5E7E', '#FFD166', '#06D6A0', '#4EA8DE', '#C77DFF', '#FF9F1C', '#F8FAFC'];

const playSound = (src: string, volume = 0.5) => {
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

  const explodeRocket = (rx: number, ry: number, baseColor: string) => {
    const burstSound =
      Math.random() > 0.5
        ? '/effects/fireworks/fire_voice/burst1.mp3'
        : '/effects/fireworks/fire_voice/burst2.mp3';
    playSound(burstSound, 0.55);
    setTimeout(() => playSound('/effects/fireworks/fire_voice/crackle-sm-1.mp3', 0.35), 220);

    const count = 90;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.14;
      const speed = 1.8 + Math.random() * 6.2;
      sparksRef.current.push({
        x: rx,
        y: ry,
        prevX: rx,
        prevY: ry,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: Math.random() > 0.25 ? baseColor : COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 2 + 1.4,
        decay: 0.011 + Math.random() * 0.01,
        flicker: Math.random() > 0.5,
      });
    }
  };

  const startLoop = () => {
    if (rafRef.current !== null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const tick = () => {
      // Motion trail fade without opaque fill so black mask transitions smoothly
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 8) r.trail.shift();

        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.06;

        // Draw rocket head & tail
        ctx.beginPath();
        if (r.trail.length > 1) {
          ctx.moveTo(r.trail[0].x, r.trail[0].y);
          for (const pt of r.trail) ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (r.y <= r.targetY || r.vy >= -0.5) {
          explodeRocket(r.x, r.y, r.color);
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
        s.vy += 0.075; // gravity
        s.vx *= 0.975;
        s.vy *= 0.975;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        const drawAlpha = s.flicker ? s.alpha * (0.6 + Math.random() * 0.4) : s.alpha;
        ctx.save();
        ctx.globalAlpha = Math.max(0, drawAlpha);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.prevX, s.prevY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.restore();
      }

      if (rockets.length > 0 || sparks.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafRef.current = null;
        // Fade out black mask once all fireworks settle
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
    const count = 1 + Math.floor(Math.random() * 3); // 1 ~ 3 fireworks

    // Wait 550ms for black mask to fade in slowly, then launch 1-3 rockets sequentially
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const liftNum = (i % 3) + 1;
        playSound(`/effects/fireworks/fire_voice/lift${liftNum}.mp3`, 0.4);

        rocketsRef.current.push({
          x: w * (0.25 + Math.random() * 0.5),
          y: h * 0.96,
          vx: (Math.random() - 0.5) * 1.8,
          vy: -(9.5 + Math.random() * 3.5),
          targetY: h * (0.18 + Math.random() * 0.25),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          trail: [],
        });

        startLoop();
      }, 550 + i * 520);
    }
  };

  return (
    <>
      {/* Gradual Black Night Mask */}
      <div
        className={`fixed inset-0 bg-black/85 pointer-events-none z-40 transition-opacity duration-700 ${
          isDarkMask ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
      />

      {/* Randomized "放个烟花" Button */}
      <button
        onClick={launchFireworks}
        disabled={isLaunching}
        style={{ top: btnPos.top, left: btnPos.left }}
        className="absolute z-30 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-md border border-white/25 text-white text-xs font-mono shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        title="点击熄灯放 1-3 个烟花（带音效）"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>🎆 放个烟花</span>
      </button>
    </>
  );
};
