import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  alpha: number;
  phase: number;
  phaseSpeed: number;
  rotation: number;
  rotSpeed: number;
}

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates (-9999 when mouse is outside)
    let mouseX = -9999;
    let mouseY = -9999;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const checkIsNight = () => {
      if (document.documentElement.classList.contains('dark')) return true;
      if (localStorage.getItem('theme') === 'light') return false;
      const hour = new Date().getHours();
      return hour >= 19 || hour < 6;
    };

    const count = 42;
    const particles: Particle[] = Array.from({ length: count }, () => {
      const baseVx = (Math.random() - 0.5) * 0.6;
      const baseVy = Math.random() * 0.8 + 0.4;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        size: Math.random() * 3.5 + 2,
        alpha: Math.random() * 0.5 + 0.35,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.04 + 0.015,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
      };
    });

    const drawSnowflake = (x: number, y: number, r: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = 'rgba(186, 220, 255, 0.95)';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.1;

      // 6-branch delicate crystal
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -r);
        ctx.stroke();
        ctx.rotate(Math.PI / 3);
      }
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawFirefly = (x: number, y: number, r: number, glowAlpha: number) => {
      ctx.save();
      const outerR = r * 4.5;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, outerR);
      grad.addColorStop(0, `rgba(255, 236, 130, ${glowAlpha})`);
      grad.addColorStop(0.35, `rgba(190, 242, 100, ${glowAlpha * 0.5})`);
      grad.addColorStop(1, 'rgba(190, 242, 100, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, outerR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 250, 205, ${Math.min(1, glowAlpha + 0.25)})`;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isNight = checkIsNight();
      const repelRadius = 135;

      particles.forEach((p) => {
        p.phase += p.phaseSpeed;
        p.rotation += p.rotSpeed;

        // Repulsion physics: fly away when mouse moves near
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);

        if (dist < repelRadius && dist > 0.1) {
          const force = ((repelRadius - dist) / repelRadius) * 2.2;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        if (isNight) {
          // Fireflies: organic floating drift
          const targetVx = Math.sin(p.phase) * 0.55;
          const targetVy = Math.cos(p.phase * 0.8) * 0.45;
          p.vx += (targetVx - p.vx) * 0.04;
          p.vy += (targetVy - p.vy) * 0.04;
        } else {
          // Snowflakes: gentle downward fall with sway
          const targetVx = p.baseVx + Math.sin(p.phase) * 0.45;
          const targetVy = p.baseVy;
          p.vx += (targetVx - p.vx) * 0.05;
          p.vy += (targetVy - p.vy) * 0.05;
        }

        // Clamp max escape velocity
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 9) {
          p.vx = (p.vx / speed) * 9;
          p.vy = (p.vy / speed) * 9;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        if (isNight) {
          const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(p.phase * 1.4));
          drawFirefly(p.x, p.y, p.size, p.alpha * pulse);
        } else {
          drawSnowflake(p.x, p.y, p.size * 1.4, p.rotation, p.alpha * 0.85);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-500"
    />
  );
};
