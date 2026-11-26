import React, { useState, useRef, useEffect } from 'react';

interface HangingSideBoardProps {
  title: string;
}

export const HangingSideBoard: React.FC<HangingSideBoardProps> = ({ title }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ px: 0, py: 0, ox: 0, oy: 0 });
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(32, now - last) / 1000;
      last = now;

      if (!draggingRef.current) {
        // Gentle idle breeze sway + damped spring return when released
        const breezeX = Math.sin(now * 0.0014) * 2.2;
        const breezeY = Math.cos(now * 0.002) * 1.1;
        const tx = targetRef.current.x + breezeX;
        const ty = targetRef.current.y + breezeY;

        const stiffness = 190;
        const damping = 11;
        const ax = (tx - posRef.current.x) * stiffness - velRef.current.x * damping;
        const ay = (ty - posRef.current.y) * stiffness - velRef.current.y * damping;

        velRef.current.x += ax * dt;
        velRef.current.y += ay * dt;
        posRef.current.x += velRef.current.x * dt;
        posRef.current.y += velRef.current.y * dt;

        setOffset({ x: posRef.current.x, y: posRef.current.y });
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setIsDragging(true);
    velRef.current = { x: 0, y: 0 };
    dragStartRef.current = {
      px: e.clientX,
      py: e.clientY,
      ox: posRef.current.x,
      oy: posRef.current.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const rawX = dragStartRef.current.ox + (e.clientX - dragStartRef.current.px);
    const rawY = dragStartRef.current.oy + (e.clientY - dragStartRef.current.py);
    // Soft rubber resistance at high stretch
    const nx = Math.max(-20, Math.min(130, rawX * 0.85));
    const ny = Math.max(-24, Math.min(140, rawY * 0.85));
    posRef.current = { x: nx, y: ny };
    setOffset({ x: nx, y: ny });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    draggingRef.current = false;
    setIsDragging(false);
    targetRef.current = { x: 0, y: 0 };
  };

  // Nail anchor is at (24, 10) inside SVG; board eyelet is at (24 + offset.x, 48 + offset.y)
  const nailX = 24;
  const nailY = 10;
  const eyeX = nailX + offset.x;
  const eyeY = 48 + offset.y;
  const midX = (nailX + eyeX) / 2 + offset.x * 0.12;
  const midY = (nailY + eyeY) / 2 + Math.max(4, Math.abs(offset.x) * 0.08);
  const tiltDeg = Math.max(-24, Math.min(24, -offset.x * 0.22));

  return (
    <aside
      className="hidden xl:block fixed left-4 top-20 z-30 select-none pointer-events-none"
      aria-label={title}
    >
      <div className="relative w-44 h-72">
        {/* Elastic SVG Rope connecting Nail to Board */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          viewBox="0 0 180 280"
        >
          {/* Rope shadow */}
          <path
            d={`M ${nailX} ${nailY} Q ${midX} ${midY} ${eyeX} ${eyeY}`}
            fill="none"
            stroke="rgba(0,0,0,0.22)"
            strokeWidth="3.5"
            strokeLinecap="round"
            transform="translate(1.5, 2)"
          />
          {/* Elastic Theme-Colored Rope */}
          <path
            d={`M ${nailX} ${nailY} Q ${midX} ${midY} ${eyeX} ${eyeY}`}
            fill="none"
            stroke="rgb(var(--theme-accent, 217 119 87))"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Minimalist Dot Pin with Drop Shadow & Highlight (matches active theme color) */}
          <circle cx={nailX} cy={nailY + 1.5} r="4.5" fill="rgba(0,0,0,0.22)" />
          <circle cx={nailX} cy={nailY} r="4" fill="rgb(var(--theme-accent, 217 119 87))" />
          <circle cx={nailX - 1.2} cy={nailY - 1.2} r="1.4" fill="#ffffff" opacity="0.85" />
        </svg>

        {/* Draggable Cardstock Paper Title Tag (卡片纸样式) */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0) rotate(${tiltDeg.toFixed(2)}deg)`,
            transformOrigin: 'top center',
            touchAction: 'none',
          }}
          title="拖拽拉扯卡片体验弹性绳索"
          className={`pointer-events-auto absolute left-[6px] top-[44px] px-3 py-4 rounded-xl border border-[#e5dfd6] dark:border-white/15 bg-[#faf7f2] dark:bg-[#23252e] shadow-[0_10px_28px_rgba(31,36,48,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col items-center gap-2.5 transition-shadow ${
            isDragging ? 'cursor-grabbing shadow-[0_18px_38px_rgba(31,36,48,0.24)]' : 'cursor-grab hover:shadow-[0_14px_32px_rgba(31,36,48,0.22)]'
          }`}
        >
          {/* Paper Punch Eyelet */}
          <span className="w-2.5 h-2.5 rounded-full bg-cream-100 dark:bg-obsidian ring-2 ring-[#d4a373]/80 shadow-inner" />

          {/* Crisp Ink Vertical Typography */}
          <div
            style={{ writingMode: 'vertical-rl' }}
            className="font-serif text-sm font-bold tracking-[0.26em] text-[#1F2430] dark:text-[#F1ECEA] py-1"
          >
            {title}
          </div>

          {/* Minimalist Bottom Accent Dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta/75" />
        </div>
      </div>
    </aside>
  );
};
