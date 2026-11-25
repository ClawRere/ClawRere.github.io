import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, ToggleLeft, ToggleRight, Layout, MessageSquare, Trash2, Plus, Check, LogOut, ExternalLink } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showButterfly, setShowButterfly] = useState(true);
  const [showMusic, setShowMusic] = useState(true);
  const [linkLayout, setLinkLayout] = useState('card');
  const [saveToast, setSaveToast] = useState('');

  // Sample guestbook state
  const [messages, setMessages] = useState<Array<{ id: number; name: string; content: string; date: string }>>([
    { id: 1, name: '小N同学', content: '磊大大的网站升级后动效太丝滑了！PMOS 产品模型很有启发。', date: '2026-11-20' },
    { id: 2, name: 'Hexo极客', content: '求问 93+ 原生动效是用什么方式内嵌无缝运行的？已收藏！', date: '2026-11-22' },
  ]);

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAdmin(true);
    }
    const bf = localStorage.getItem('show_butterfly');
    if (bf === 'false') setShowButterfly(false);
    const ms = localStorage.getItem('show_music_player');
    if (ms === 'false') setShowMusic(false);
    const layout = localStorage.getItem('links_default_layout');
    if (layout) setLinkLayout(layout);

    // Load guestbook messages from localStorage
    const savedMsg = localStorage.getItem('guestbook_messages');
    if (savedMsg) {
      try {
        setMessages(JSON.parse(savedMsg));
      } catch (e) {}
    }
  }, []);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 2500);
  };

  const toggleButterflySetting = () => {
    const next = !showButterfly;
    setShowButterfly(next);
    localStorage.setItem('show_butterfly', String(next));
    triggerToast(next ? '已开启全站飞行蝴蝶' : '已关闭飞行蝴蝶');
  };

  const toggleMusicSetting = () => {
    const next = !showMusic;
    setShowMusic(next);
    localStorage.setItem('show_music_player', String(next));
    triggerToast(next ? '已开启网易云随身听' : '已隐藏网易云随身听');
  };

  const handleLayoutChange = (layout: string) => {
    setLinkLayout(layout);
    localStorage.setItem('links_default_layout', layout);
    triggerToast(`默认书签布局已切换为：${layout === 'card' ? '卡片网格' : layout === 'compact' ? '紧凑单链' : '画中画内嵌'}`);
  };

  const deleteMessage = (id: number) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem('guestbook_messages', JSON.stringify(updated));
    triggerToast('留言已删除');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    window.location.href = '/login';
  };

  if (!isAdmin) {
    return (
      <div className="p-8 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-serif text-xl font-bold">请先登录管理员账号</h2>
        <p className="text-xs text-charcoal-100 dark:text-cream-400">
          管理工作台仅供站长配置系统动效与维护留言。
        </p>
        <a
          href="/login"
          className="inline-block px-5 py-2.5 rounded-full bg-terracotta text-white font-mono text-xs"
        >
          前往登录页面
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-br from-cream-100/60 to-terracotta-50/20 dark:from-obsidian-card dark:to-obsidian">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-terracotta text-white flex items-center justify-center shadow-glow-terracotta">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-DEFAULT dark:text-cream-50">
              站长系统管理工作台
            </h1>
            <p className="text-xs font-mono text-charcoal-100 dark:text-cream-400 mt-0.5">
              Admin: ldd · 权限: 全站系统配置与内容审核
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full glass hover:bg-red-500 hover:text-white text-xs font-mono transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>退出登录</span>
        </button>
      </div>

      {saveToast && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 1. Global Effects & Layout Controls */}
      <div className="p-6 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 space-y-6">
        <div className="flex items-center gap-2 border-b border-charcoal-500/10 dark:border-white/10 pb-3">
          <Settings className="w-4 h-4 text-terracotta" />
          <h2 className="font-serif text-lg font-bold text-charcoal-DEFAULT dark:text-cream-50">
            全站特效与布局偏好配置
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Butterfly Toggle */}
          <div className="p-4 rounded-2xl glass border border-charcoal-500/5 dark:border-white/5 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs sm:text-sm block">全站飞舞蝴蝶 (3D Butterfly)</span>
              <span className="text-[11px] text-charcoal-100 dark:text-cream-400">页面上自动巡游并可交互捕获的蝴蝶</span>
            </div>
            <button
              onClick={toggleButterflySetting}
              className={`p-1.5 rounded-xl font-mono text-xs flex items-center gap-1 transition-colors ${
                showButterfly ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-500'
              }`}
            >
              {showButterfly ? '已开启' : '已关闭'}
            </button>
          </div>

          {/* Music Toggle */}
          <div className="p-4 rounded-2xl glass border border-charcoal-500/5 dark:border-white/5 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs sm:text-sm block">网易云音乐随身听 (Music Pill)</span>
              <span className="text-[11px] text-charcoal-100 dark:text-cream-400">页面左下角常驻黑胶音乐挂件</span>
            </div>
            <button
              onClick={toggleMusicSetting}
              className={`p-1.5 rounded-xl font-mono text-xs flex items-center gap-1 transition-colors ${
                showMusic ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-500'
              }`}
            >
              {showMusic ? '已开启' : '已关闭'}
            </button>
          </div>
        </div>

        {/* Link layout selection */}
        <div>
          <label className="block text-xs font-mono text-charcoal-200 dark:text-cream-300 mb-2">
            链接/书签页面默认布局 (Link Default Layout):
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'card', name: '🗂️ 沉浸卡片模式 (Card Grid)' },
              { id: 'compact', name: '📋 紧凑单链模式 (Compact List)' },
              { id: 'split', name: '🖥️ 画中画内嵌预览模式 (Split Drawer)' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleLayoutChange(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
                  linkLayout === item.id
                    ? 'bg-terracotta text-white shadow-sm'
                    : 'glass text-charcoal-200 dark:text-cream-400 hover:text-charcoal'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Message Board Management */}
      <div className="p-6 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-charcoal-500/10 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-terracotta" />
            <h2 className="font-serif text-lg font-bold text-charcoal-DEFAULT dark:text-cream-50">
              留言板审核与维护 ({messages.length})
            </h2>
          </div>
          <a href="/messageboard" className="text-xs font-mono text-terracotta hover:underline">
            查看公开留言板 →
          </a>
        </div>

        <div className="divide-y divide-charcoal-500/10 dark:divide-white/10">
          {messages.map((m) => (
            <div key={m.id} className="py-3 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-charcoal-DEFAULT dark:text-cream-100">{m.name}</span>
                  <span className="text-charcoal-100 dark:text-cream-400">{m.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-charcoal-200 dark:text-cream-200 mt-1">
                  {m.content}
                </p>
              </div>

              <button
                onClick={() => deleteMessage(m.id)}
                className="p-1.5 text-charcoal-100 hover:text-red-500 transition-colors"
                title="删除留言"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
