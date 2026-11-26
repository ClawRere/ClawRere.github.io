import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    name: '密信访客 · 可测试阅后即焚',
    content: '这是一条「阅后即焚」加密留言！点击揭晓后开始 5 秒倒计时，倒计时结束物理火焰将从底部焚烧卡片，灰烬自然飘落堆积在下一条留言上方 🔥',
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

// Realistic Canvas Flame + Rising Embers + Gravity Ash Flakes
const BurnCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.offsetWidth || 600);
    const h = (canvas.height = canvas.offsetHeight || 160);
    let startTime = performance.now();
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

      // Charred dark area below the burn front
      if (burnLineY < h) {
        const charGrad = ctx.createLinearGradient(0, burnLineY - 12, 0, h);
        charGrad.addColorStop(0, 'rgba(255, 110, 20, 0.85)');
        charGrad.addColorStop(0.18, 'rgba(38, 22, 18, 0.92)');
        charGrad.addColorStop(1, 'rgba(18, 18, 20, 0.98)');
        ctx.fillStyle = charGrad;
        ctx.fillRect(0, Math.max(0, burnLineY), w, h);
      }

      // Spawn glowing flame embers & dark ash flakes along the burning edge
      for (let i = 0; i < 10; i++) {
        const isAsh = Math.random() > 0.58;
        particles.push({
          x: Math.random() * w,
          y: Math.max(0, Math.min(h, burnLineY + (Math.random() - 0.5) * 16)),
          vx: (Math.random() - 0.5) * 1.6,
          vy: isAsh ? 0.6 + Math.random() * 1.8 : -(1.5 + Math.random() * 3.4),
          r: isAsh ? 1.8 + Math.random() * 2.5 : 1.5 + Math.random() * 3.2,
          life: 0,
          maxLife: 25 + Math.random() * 35,
          isAsh,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.2,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx + Math.sin(p.life * 0.2) * 0.4;
        p.y += p.vy;
        p.rot += p.rotV;
        const alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        if (p.isAsh) {
          ctx.fillStyle = '#71717a';
          ctx.fillRect(-p.r, -p.r * 0.6, p.r * 2, p.r * 1.2);
        } else {
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 2.2);
          g.addColorStop(0, '#fff7ed');
          g.addColorStop(0.4, '#fb923c');
          g.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (elapsed < 1 || particles.length > 0) {
        raf = requestAnimationFrame(render);
      }
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-30" />;
};

// Organic Physical Ash Pile settled on the top edge of the next card
const AshPile: React.FC = () => {
  const flakes = React.useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        left: `${(i / 42) * 100 + (Math.sin(i * 3.1) * 1.5)}%`,
        top: `${(i % 4) * 2.2}px`,
        w: 3 + (i % 5) * 1.4,
        h: 2 + (i % 3) * 1.1,
        rot: (i * 37) % 180,
        ember: i % 11 === 0,
        opacity: 0.45 + ((i * 7) % 5) * 0.11,
      })),
    []
  );

  return (
    <div
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
          className={`absolute rounded-[1px] ${
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
        const idx = curr.findIndex((m) => m.id === id);
        if (idx === -1) return curr;
        const updated = curr
          .filter((m) => m.id !== id)
          .map((m, i) => (i === idx ? { ...m, hasAshFromAbove: true } : m));
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
    <div className="space-y-8 max-w-3xl mx-auto py-4">
      <div className="p-6 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">
          <MessageSquare className="w-4 h-4" /> Community Guestbook
        </div>
        <p className="text-xs sm:text-sm text-charcoal-100 dark:text-cream-300 leading-relaxed font-serif">
          欢迎在此写下想法、点赞或申请友链。开启 <strong>「🔥 阅后即焚」</strong> 后将打马赛克，点击阅读 <strong>5 秒</strong> 后触发物理火焰焚毁并留下灰烬。
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-lg font-bold text-charcoal-DEFAULT dark:text-cream-50 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta" />
            留下你的足迹
          </h2>

          <button
            type="button"
            onClick={() => setIsBurnMode(!isBurnMode)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all border ${
              isBurnMode
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-400 shadow-lg'
                : 'glass border-charcoal-500/15 dark:border-white/15 text-charcoal-200 dark:text-cream-300 hover:border-orange-400/50'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${isBurnMode ? 'animate-pulse' : ''}`} />
            <span>{isBurnMode ? '🔥 5s 阅后即焚已开启' : '开启阅后即焚'}</span>
          </button>
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

      {/* Cards List */}
      <div className="space-y-4">
        <AnimatePresence>
          {messages.map((msg) => {
            const countdown = revealedIds[msg.id];
            const isRevealed = countdown !== undefined;
            const isBurning = !!burningIds[msg.id];

            return (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={
                  isBurning
                    ? { opacity: 0.7, scale: 0.98 }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
                transition={{ duration: 0.45 }}
                className={`relative rounded-2xl glass border p-5 transition-all overflow-hidden ${
                  msg.isBurnAfterReading
                    ? 'border-orange-500/35 bg-gradient-to-br from-orange-500/5 to-red-500/5'
                    : 'border-charcoal-500/10 dark:border-white/10'
                }`}
              >
                {msg.hasAshFromAbove && <AshPile />}
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
                    className="relative cursor-pointer rounded-xl p-4 bg-black/5 dark:bg-white/5 overflow-hidden group"
                  >
                    <p className="text-sm leading-relaxed blur-[9px] select-none opacity-60">
                      {msg.content}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <span className="px-4 py-1.5 rounded-full bg-zinc-900/90 text-white text-xs font-mono flex items-center gap-1.5 shadow-xl border border-white/15 group-hover:scale-105 transition-transform">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        点击显示密信（5s 后焚毁）
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-charcoal-200 dark:text-cream-200 leading-relaxed">
                    {msg.content}
                  </p>
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
