import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  MessageSquare,
  Trash2,
  Check,
  LogOut,
  KeyRound,
  Home,
  Sliders,
  MoveDiagonal2,
  RotateCcw,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

type AdminTab = 'layout' | 'home' | 'about' | 'guestbook' | 'api';

export const AdminDashboard: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('layout');
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  // Draggable layout sizes
  const [cardScale, setCardScale] = useState(1.0);
  const [pillScale, setPillScale] = useState(1.0);
  const [pipHeightVh, setPipHeightVh] = useState(78);
  const [linkLayout, setLinkLayout] = useState('card');

  // Global / Home states
  const [showMusic, setShowMusic] = useState(true);
  const [isNightTheme, setIsNightTheme] = useState(false);
  const [heroPhrasesText, setHeroPhrasesText] = useState(
    '用 AI 重新定义产品边界 · Co-creating with Intelligence\n5W1H 穿透本质 · 假设与事实分层决策\nApple 流体动效 × Claude 人文温润质感\n欢迎来到磊大大的数字花园 · Digital Garden'
  );

  // About page states
  const [aboutBio, setAboutBio] = useState('AI 产品经理 / 体验架构师 / 数字花园园丁。专注于 Agent 操作系统、证据分层决策与极致流体交互。');
  const [aboutEmail, setAboutEmail] = useState('2472919073@qq.com');

  // Guestbook states
  const [messages, setMessages] = useState<Array<{ id: number; name: string; content: string; date: string }>>([
    { id: 1, name: '小N同学', content: '磊大大的网站升级后动效太丝滑了！PMOS 产品模型很有启发。', date: '2026-11-20' },
    { id: 2, name: 'Hexo极客', content: '求问 93+ 原生动效是用什么方式内嵌无缝运行的？已收藏！', date: '2026-11-22' },
  ]);

  // API config states
  const [ghRepo, setGhRepo] = useState('ClawRere/ClawRere.github.io');
  const [ghToken, setGhToken] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookKey, setWebhookKey] = useState('');

  // Dragging refs
  const draggingRef = useRef<'card' | 'pill' | 'pip' | null>(null);
  const startPosRef = useRef<{ x: number; y: number; initVal: number }>({ x: 0, y: 0, initVal: 1 });

  useEffect(() => {
    if (localStorage.getItem('admin_authenticated') === 'true') setIsAdmin(true);

    const cs = parseFloat(localStorage.getItem('layout_card_scale') || '1');
    if (!isNaN(cs)) setCardScale(cs);
    const ps = parseFloat(localStorage.getItem('layout_pill_scale') || '1');
    if (!isNaN(ps)) setPillScale(ps);
    const ph = parseInt(localStorage.getItem('layout_pip_vh') || '78', 10);
    if (!isNaN(ph)) setPipHeightVh(ph);

    const layout = localStorage.getItem('links_layout');
    if (layout) setLinkLayout(layout);

    if (localStorage.getItem('show_music') === 'false') setShowMusic(false);
    setIsNightTheme(document.documentElement.classList.contains('dark'));

    const savedPhrases = localStorage.getItem('hero_phrases');
    if (savedPhrases) {
      try {
        const arr = JSON.parse(savedPhrases);
        if (Array.isArray(arr)) setHeroPhrasesText(arr.join('\n'));
      } catch {}
    }

    try {
      const ac = localStorage.getItem('about_config');
      if (ac) {
        const parsed = JSON.parse(ac);
        if (parsed.bio) setAboutBio(parsed.bio);
        if (parsed.email) setAboutEmail(parsed.email);
      }
      const gm = localStorage.getItem('guestbook_messages');
      if (gm) setMessages(JSON.parse(gm));
    } catch {}

    setGhRepo(localStorage.getItem('admin_gh_repo') || 'ClawRere/ClawRere.github.io');
    setGhToken(localStorage.getItem('admin_gh_token') || '');
    setWebhookUrl(localStorage.getItem('admin_webhook_url') || '');
    setWebhookKey(localStorage.getItem('admin_webhook_key') || '');
  }, []);

  // Global mouse move / up listeners for drag-to-resize handles
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;

      if (draggingRef.current === 'card') {
        const next = Math.max(0.75, Math.min(1.35, Number((startPosRef.current.initVal + dx / 240).toFixed(2))));
        setCardScale(next);
        document.documentElement.style.setProperty('--card-scale', String(next));
        localStorage.setItem('layout_card_scale', String(next));
      } else if (draggingRef.current === 'pill') {
        const next = Math.max(0.75, Math.min(1.4, Number((startPosRef.current.initVal + dx / 200).toFixed(2))));
        setPillScale(next);
        document.documentElement.style.setProperty('--pill-scale', String(next));
        localStorage.setItem('layout_pill_scale', String(next));
      } else if (draggingRef.current === 'pip') {
        const next = Math.max(55, Math.min(90, Math.round(startPosRef.current.initVal + dy / 4)));
        setPipHeightVh(next);
        document.documentElement.style.setProperty('--pip-height', `${next}vh`);
        localStorage.setItem('layout_pip_vh', String(next));
      }
    };

    const onUp = () => {
      if (draggingRef.current) {
        draggingRef.current = null;
        notify('板块尺寸已实时保存并应用至全站');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const startDrag = (type: 'card' | 'pill' | 'pip', e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = type;
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      initVal: type === 'card' ? cardScale : type === 'pill' ? pillScale : pipHeightVh,
    };
  };

  const resetSizes = () => {
    setCardScale(1);
    setPillScale(1);
    setPipHeightVh(78);
    localStorage.setItem('layout_card_scale', '1');
    localStorage.setItem('layout_pill_scale', '1');
    localStorage.setItem('layout_pip_vh', '78');
    document.documentElement.style.setProperty('--card-scale', '1');
    document.documentElement.style.setProperty('--pill-scale', '1');
    document.documentElement.style.setProperty('--pip-height', '78vh');
    notify('已恢复所有板块默认尺寸');
  };

  const notify = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    window.location.href = '/login';
  };

  const toggleMusic = () => {
    const next = !showMusic;
    setShowMusic(next);
    localStorage.setItem('show_music', String(next));
    notify(next ? '已开启左下角音乐胶囊' : '已隐藏音乐胶囊');
  };

  const toggleDayNight = () => {
    const next = !isNightTheme;
    setIsNightTheme(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    notify(next ? '已切换为夜间模式（萤火虫背景）' : '已切换为白天模式（飘雪背景）');
  };

  const handleLayoutChange = (layout: string) => {
    setLinkLayout(layout);
    localStorage.setItem('links_layout', layout);
    notify(`友链默认视图已切换为：${layout === 'card' ? '卡片' : layout === 'compact' ? '列表' : '画中画 (80%+)'}`);
  };

  const saveHeroPhrases = () => {
    const phrases = heroPhrasesText.split('\n').map((s) => s.trim()).filter(Boolean);
    localStorage.setItem('hero_phrases', JSON.stringify(phrases));
    notify('打字机标语已更新');
  };

  const saveAboutConfig = () => {
    localStorage.setItem('about_config', JSON.stringify({ bio: aboutBio.trim(), email: aboutEmail.trim() }));
    notify('关于页面内容已保存，访问 /about 即可查看！');
  };

  const deleteMessage = (id: number) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem('guestbook_messages', JSON.stringify(updated));
    notify('留言已删除');
  };

  const saveApiConfig = () => {
    localStorage.setItem('admin_gh_repo', ghRepo.trim());
    localStorage.setItem('admin_gh_token', ghToken.trim());
    localStorage.setItem('admin_webhook_url', webhookUrl.trim());
    localStorage.setItem('admin_webhook_key', webhookKey.trim());
    notify('API 凭证已安全保存至本地浏览器');
  };

  if (!isAdmin) {
    return (
      <div className="p-8 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 text-center max-w-md mx-auto space-y-4 my-12">
        <h2 className="font-serif text-xl font-bold">请先登录管理员账号</h2>
        <p className="text-xs text-charcoal-100 dark:text-cream-400">
          登录后可拖拽调节全站板块与胶囊大小，并在博客、友链、工具箱页面直接新增内容。
        </p>
        <a href="/login" className="inline-block px-5 py-2.5 rounded-full bg-terracotta text-white font-mono text-xs">
          前往登录页面
        </a>
      </div>
    );
  }

  const navTabs: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'layout', label: '拖拽调节板块大小', icon: Sliders },
    { id: 'home', label: '全局开关与标语', icon: Home },
    { id: 'about', label: '关于页面管理', icon: ShieldCheck },
    { id: 'guestbook', label: '留言板审核', icon: MessageSquare },
    { id: 'api', label: 'API 发布配置', icon: KeyRound },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="p-6 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-terracotta text-white flex items-center justify-center shadow-glow-terracotta">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-DEFAULT dark:text-cream-50">
              全站布局与板块尺寸控制台
            </h1>
            <p className="text-xs font-mono text-charcoal-100 dark:text-cream-400">
              提示：文章、友链、工具的新增按钮已直接内嵌在各页面顶部（仅登录后可见）
            </p>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-full glass hover:bg-red-500 hover:text-white text-xs font-mono transition-colors">
          <LogOut className="w-3.5 h-3.5" />
          <span>退出登录</span>
        </button>
      </div>

      {/* Quick Jump Links to Page-level Editors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: '/posts', title: '✍️ 前往博客页写新文章', sub: '页面右上角「写新文章」按钮' },
          { href: '/links', title: '🔖 前往友链页新增站点', sub: '顶部工具栏「+ 新增友链」按钮' },
          { href: '/tools', title: '🛠️ 前往工具箱新增画中画', sub: '标签栏右侧「+ 新增工具」按钮' },
        ].map((item) => (
          <a key={item.href} href={item.href} className="p-4 rounded-2xl glass border border-charcoal-500/10 dark:border-white/10 hover:border-terracotta/40 transition-all flex items-center justify-between group">
            <div>
              <div className="font-semibold text-sm group-hover:text-terracotta transition-colors">{item.title}</div>
              <div className="text-[11px] opacity-65 mt-0.5">{item.sub}</div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:text-terracotta group-hover:opacity-100" />
          </a>
        ))}
      </div>

      {toast && (
        <div className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center gap-2 ${toast.type === 'ok' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500' : 'bg-red-500/10 border-red-500/25 text-red-500'}`}>
          {toast.type === 'ok' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {navTabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                active ? 'bg-terracotta text-white border-terracotta shadow-sm' : 'glass border-charcoal-500/10 dark:border-white/10 text-charcoal-200 dark:text-cream-300 hover:border-terracotta/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 space-y-6">
        {/* 1. DRAG-TO-RESIZE LAYOUT PANEL */}
        {activeTab === 'layout' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg font-bold">可视化拖拽调整板块、卡片与胶囊大小</h2>
                <p className="text-xs opacity-65 mt-0.5">按住下方示例组件右下角手柄左右/上下拖拽，即可实时调整全站比例</p>
              </div>
              <button onClick={resetSizes} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-charcoal-500/15 dark:border-white/15 text-xs font-mono hover:border-terracotta">
                <RotateCcw className="w-3.5 h-3.5" /> 恢复默认
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Drag 1: Card Size */}
              <div className="p-5 rounded-2xl border border-charcoal-500/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold">1. 跳转卡片缩放比例</span>
                  <span className="text-terracotta font-semibold">{Math.round(cardScale * 100)}%</span>
                </div>

                <div className="h-36 flex items-center justify-center overflow-hidden">
                  <div
                    style={{ transform: `scale(${cardScale})` }}
                    className="relative w-52 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-terracotta/30 shadow-lg select-none"
                  >
                    <div className="text-lg">🚀</div>
                    <div className="font-bold text-sm mt-1">示例跳转卡片</div>
                    <div className="text-[11px] opacity-60">拖拽右下角调节大小</div>
                    <div
                      onMouseDown={(e) => startDrag('card', e)}
                      className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-terracotta text-white flex items-center justify-center cursor-ew-resize shadow-md"
                      title="按住左右拖拽调节卡片大小"
                    >
                      <MoveDiagonal2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <input
                  type="range"
                  min={0.75}
                  max={1.35}
                  step={0.05}
                  value={cardScale}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setCardScale(v);
                    document.documentElement.style.setProperty('--card-scale', String(v));
                    localStorage.setItem('layout_card_scale', String(v));
                  }}
                  className="w-full accent-terracotta"
                />
              </div>

              {/* Drag 2: Capsule Pill Size */}
              <div className="p-5 rounded-2xl border border-charcoal-500/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold">2. 胶囊按钮缩放比例</span>
                  <span className="text-terracotta font-semibold">{Math.round(pillScale * 100)}%</span>
                </div>

                <div className="h-36 flex items-center justify-center overflow-hidden">
                  <div
                    style={{ transform: `scale(${pillScale})` }}
                    className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white border border-white/20 shadow-xl select-none"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
                    <span className="text-xs font-medium">示例胶囊 (音乐/工具Tab)</span>
                    <div
                      onMouseDown={(e) => startDrag('pill', e)}
                      className="ml-1 w-5 h-5 rounded-full bg-terracotta text-white flex items-center justify-center cursor-ew-resize shadow"
                      title="按住左右拖拽调节胶囊大小"
                    >
                      <MoveDiagonal2 className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <input
                  type="range"
                  min={0.75}
                  max={1.4}
                  step={0.05}
                  value={pillScale}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPillScale(v);
                    document.documentElement.style.setProperty('--pill-scale', String(v));
                    localStorage.setItem('layout_pill_scale', String(v));
                  }}
                  className="w-full accent-terracotta"
                />
              </div>
            </div>

            {/* Drag 3: PiP Height */}
            <div className="p-5 rounded-2xl border border-charcoal-500/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold">3. 画中画容器视口高度（工具箱 & 友链分栏模式）</span>
                <span className="text-terracotta font-semibold">{pipHeightVh}vh</span>
              </div>

              <div
                style={{ height: `${Math.round(pipHeightVh * 1.4)}px` }}
                className="relative w-full rounded-2xl border border-terracotta/30 bg-white/60 dark:bg-zinc-900/70 flex items-center justify-center text-xs font-mono opacity-80 select-none transition-[height]"
              >
                画中画窗口高度预览 ({pipHeightVh}% 视口高度)
                <div
                  onMouseDown={(e) => startDrag('pip', e)}
                  className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-terracotta text-white text-[10px] cursor-ns-resize shadow-md"
                  title="按住上下拖拽调节画中画高度"
                >
                  ↕ 上下拖拽高度
                </div>
              </div>

              <input
                type="range"
                min={55}
                max={90}
                step={1}
                value={pipHeightVh}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPipHeightVh(v);
                  document.documentElement.style.setProperty('--pip-height', `${v}vh`);
                  localStorage.setItem('layout_pip_vh', String(v));
                }}
                className="w-full accent-terracotta"
              />
            </div>

            {/* Link default mode */}
            <div className="pt-2 border-t border-charcoal-500/10 dark:border-white/10">
              <span className="block text-xs font-mono mb-2.5 font-bold">友链默认展示模式：</span>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: 'card', name: '🗂️ 卡片网格' },
                  { id: 'compact', name: '📋 紧凑列表' },
                  { id: 'split', name: '🖥️ 画中画 (80%+)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLayoutChange(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
                      linkLayout === item.id ? 'bg-terracotta text-white' : 'glass border border-charcoal-500/10 dark:border-white/10'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. HOME & GLOBAL */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <h2 className="font-serif text-lg font-bold">全站环境开关与首页打字机标语</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-charcoal-500/10 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">场景模式（白天飘雪 / 夜间萤火虫）</span>
                  <span className="text-xs opacity-60">当前：{isNightTheme ? '✨ 夜间萤火虫' : '❄️ 白天飘雪'}</span>
                </div>
                <button onClick={toggleDayNight} className="px-3 py-1.5 rounded-xl bg-terracotta/15 text-terracotta text-xs font-mono">
                  一键切换
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-charcoal-500/10 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm block">左下角网易云音乐胶囊</span>
                  <span className="text-xs opacity-60">歌单 ID: 9333187603</span>
                </div>
                <button
                  onClick={toggleMusic}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs ${showMusic ? 'bg-emerald-500/15 text-emerald-500' : 'bg-red-500/15 text-red-500'}`}
                >
                  {showMusic ? '已开启' : '已关闭'}
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-charcoal-500/10 dark:border-white/10">
              <label className="block text-xs font-mono">首页打字机轮播标语（每行一条）</label>
              <textarea
                rows={4}
                value={heroPhrasesText}
                onChange={(e) => setHeroPhrasesText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono"
              />
              <button onClick={saveHeroPhrases} className="px-5 py-2 rounded-xl bg-terracotta text-white text-xs font-mono hover:opacity-90">
                保存打字机标语
              </button>
            </div>
          </div>
        )}

        {/* 3. ABOUT PAGE */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold">关于页面内容管理 (/about)</h2>
              <a href="/about" className="text-xs font-mono text-terracotta hover:underline">预览关于页面 →</a>
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5">个人简介文案</label>
              <textarea
                rows={4}
                value={aboutBio}
                onChange={(e) => setAboutBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5">联系邮箱</label>
              <input
                type="email"
                value={aboutEmail}
                onChange={(e) => setAboutEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm font-mono"
              />
            </div>
            <button onClick={saveAboutConfig} className="px-5 py-2 rounded-xl bg-terracotta text-white text-xs font-mono hover:opacity-90">
              保存关于页面配置
            </button>
          </div>
        )}

        {/* 4. GUESTBOOK */}
        {activeTab === 'guestbook' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold">留言板审核 ({messages.length})</h2>
              <a href="/messageboard" className="text-xs font-mono text-terracotta hover:underline">查看留言板 →</a>
            </div>
            <div className="divide-y divide-charcoal-500/10 dark:divide-white/10">
              {messages.map((m) => (
                <div key={m.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold">{m.name}</span>
                      <span className="opacity-60">{m.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm mt-1 opacity-85">{m.content}</p>
                  </div>
                  <button onClick={() => deleteMessage(m.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. API CONFIG */}
        {activeTab === 'api' && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-lg font-bold">API 自动化发布接入配置</h2>
              <p className="text-xs opacity-70 mt-1">
                配置后，在博客页「写新文章」点击 API 一键发布即可自动提交到 GitHub 仓库触发部署。
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono mb-1">GitHub 仓库 (owner/repo)</label>
                <input type="text" value={ghRepo} onChange={(e) => setGhRepo(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono" />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1">GitHub Personal Access Token</label>
                <input type="password" value={ghToken} onChange={(e) => setGhToken(e.target.value)} placeholder="ghp_xxxxxxxxxxxx" className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono" />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1">自定义 Webhook API Endpoint (可选)</label>
                <input type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://your-api.example.com/publish" className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono" />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1">Webhook Bearer Key (可选)</label>
                <input type="password" value={webhookKey} onChange={(e) => setWebhookKey(e.target.value)} placeholder="sk-..." className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono" />
              </div>
            </div>
            <button onClick={saveApiConfig} className="px-5 py-2.5 rounded-xl bg-terracotta text-white text-xs font-mono hover:opacity-90">
              保存 API 凭证
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
