import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

const COLORS = ['#FF5E7E', '#FFD166', '#06D6A0', '#4EA8DE', '#C77DFF', '#FF9F1C', '#FFFFFF'];

export const FireworksOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<FireworkParticle[]>([]);
  const rafRef = useRef<number | null>(null);
  const [btnPos, setBtnPos] = useState<{ top: string; left: string }>({ top: '76%', left: '14%' });

  // Randomize initial position within safe bounds on hero cover
  useEffect(() => {
    const top = Math.round(18 + Math.random() * 62); // 18% ~ 80%
    const left = Math.round(10 + Math.random() * 72); // 10% ~ 82%
    setBtnPos({ top: `${top}%`, left: `${left}%` });
  }, []);

  const startLoop = () => {
    if (rafRef.current !== null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const list = particlesRef.current;

      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.vx *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          list.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (list.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const launchFirework = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Launch 2 bursts at pleasant sky positions
    for (let b = 0; b < 2; b++) {
      const cx = w * (0.2 + Math.random() * 0.6);
      const cy = h * (0.18 + Math.random() * 0.42);
      const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];

      for (let i = 0; i < 65; i++) {
        const angle = (Math.PI * 2 * i) / 65 + (Math.random() - 0.5) * 0.15;
        const speed = 2.2 + Math.random() * 4.8;
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.3 ? baseColor : COLORS[Math.floor(Math.random() * COLORS.length)],
          size: Math.random() * 2.2 + 1.5,
          decay: 0.012 + Math.random() * 0.012,
        });
      }
    }

    startLoop();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
      />
      <button
        onClick={launchFirework}
        style={{ top: btnPos.top, left: btnPos.left }}
        className="absolute z-30 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-md border border-white/25 text-white text-xs font-mono shadow-xl transition-all hover:scale-105 active:scale-95"
        title="点击放个烟花！"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>🎆 放个烟花</span>
      </button>
    </>
  );
};
