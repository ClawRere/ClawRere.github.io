import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  MessageSquare,
  Trash2,
  Check,
  LogOut,
  FileText,
  Link2,
  Wrench,
  Gamepad2,
  KeyRound,
  Send,
  Download,
  Plus,
  Home,
  AlertCircle,
} from 'lucide-react';

type AdminTab = 'home' | 'posts' | 'links' | 'tools' | 'entertain' | 'guestbook' | 'api';

interface CustomLink {
  name: string;
  link: string;
  avatar: string;
  descr: string;
  category: string;
}

interface CustomTool {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  src: string;
  externalUrl: string;
  type: 'iframe';
}

interface CustomEntertain {
  id: string;
  title: string;
  emoji: string;
  desc: string;
  link: string;
}

export const AdminDashboard: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('home');
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  // 1. Global / Home states
  const [showMusic, setShowMusic] = useState(true);
  const [isNightTheme, setIsNightTheme] = useState(false);
  const [heroBgUrl, setHeroBgUrl] = useState('');
  const [heroPhrasesText, setHeroPhrasesText] = useState(
    '用 AI 重新定义产品边界 · Co-creating with Intelligence\n5W1H 穿透本质 · 假设与事实分层决策\nApple 流体动效 × Claude 人文温润质感\n欢迎来到磊大大的数字花园 · Digital Garden'
  );

  // 2. Post creator states
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('AI 产品');
  const [postTags, setPostTags] = useState('AI, 产品思考');
  const [postDesc, setPostDesc] = useState('');
  const [postCover, setPostCover] = useState('');
  const [postBody, setPostBody] = useState('## 背景\n\n## 核心思路\n\n## 总结\n');
  const [isPublishing, setIsPublishing] = useState(false);

  // 3. Links manager states
  const [linkLayout, setLinkLayout] = useState('card');
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [newLink, setNewLink] = useState<CustomLink>({
    name: '',
    link: '',
    avatar: '',
    descr: '',
    category: '友情链接',
  });

  // 4. Tools manager states
  const [customTools, setCustomTools] = useState<CustomTool[]>([]);
  const [newTool, setNewTool] = useState({ label: '', emoji: '🧰', desc: '', src: '' });

  // 5. Entertain manager states
  const [customEntertain, setCustomEntertain] = useState<CustomEntertain[]>([]);
  const [newEntertain, setNewEntertain] = useState({ title: '', emoji: '🎮', desc: '', link: '' });

  // 6. Guestbook states
  const [messages, setMessages] = useState<Array<{ id: number; name: string; content: string; date: string }>>([
    { id: 1, name: '小N同学', content: '磊大大的网站升级后动效太丝滑了！PMOS 产品模型很有启发。', date: '2026-11-20' },
    { id: 2, name: 'Hexo极客', content: '求问 93+ 原生动效是用什么方式内嵌无缝运行的？已收藏！', date: '2026-11-22' },
  ]);

  // 7. API config states
  const [ghRepo, setGhRepo] = useState('ClawRere/ClawRere.github.io');
  const [ghToken, setGhToken] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookKey, setWebhookKey] = useState('');

  useEffect(() => {
    if (localStorage.getItem('admin_authenticated') === 'true') setIsAdmin(true);

    if (localStorage.getItem('show_music') === 'false') setShowMusic(false);
    setIsNightTheme(document.documentElement.classList.contains('dark'));

    const bg = localStorage.getItem('blogbg');
    if (bg) {
      try {
        const parsed = JSON.parse(bg);
        if (parsed.value) setHeroBgUrl(parsed.value);
      } catch {}
    }

    const savedPhrases = localStorage.getItem('hero_phrases');
    if (savedPhrases) {
      try {
        const arr = JSON.parse(savedPhrases);
        if (Array.isArray(arr)) setHeroPhrasesText(arr.join('\n'));
      } catch {}
    }

    const layout = localStorage.getItem('links_layout');
    if (layout) setLinkLayout(layout);

    try {
      const cl = localStorage.getItem('custom_links');
      if (cl) setCustomLinks(JSON.parse(cl));
      const ct = localStorage.getItem('custom_tools');
      if (ct) setCustomTools(JSON.parse(ct));
      const ce = localStorage.getItem('custom_entertain');
      if (ce) setCustomEntertain(JSON.parse(ce));
      const gm = localStorage.getItem('guestbook_messages');
      if (gm) setMessages(JSON.parse(gm));
    } catch {}

    setGhRepo(localStorage.getItem('admin_gh_repo') || 'ClawRere/ClawRere.github.io');
    setGhToken(localStorage.getItem('admin_gh_token') || '');
    setWebhookUrl(localStorage.getItem('admin_webhook_url') || '');
    setWebhookKey(localStorage.getItem('admin_webhook_key') || '');
  }, []);

  const notify = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    window.location.href = '/login';
  };

  // --- Home & Global Handlers ---
  const toggleMusic = () => {
    const next = !showMusic;
    setShowMusic(next);
    localStorage.setItem('show_music', String(next));
    notify(next ? '已开启左下角同步音乐胶囊' : '已隐藏音乐胶囊');
  };

  const toggleDayNight = () => {
    const next = !isNightTheme;
    setIsNightTheme(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    notify(next ? '已切换为夜间模式（萤火虫背景）' : '已切换为白天模式（飘雪背景）');
  };

  const saveHeroSettings = () => {
    if (heroBgUrl.trim()) {
      const type = heroBgUrl.startsWith('#') ? 'color' : heroBgUrl.includes('gradient') ? 'gradient' : 'image';
      localStorage.setItem('blogbg', JSON.stringify({ type, value: heroBgUrl.trim() }));
    }
    const phrases = heroPhrasesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    localStorage.setItem('hero_phrases', JSON.stringify(phrases));
    notify('首页封面与打字机文案已保存！刷新首页即可查看效果');
  };

  // --- GitHub API Helper ---
  const pushToGitHub = async (path: string, contentText: string, commitMsg: string) => {
    if (!ghToken.trim()) {
      throw new Error('请先在「API 接入配置」中填写 GitHub Personal Access Token');
    }
    const apiUrl = `https://api.github.com/repos/${ghRepo}/contents/${path}`;
    let sha: string | undefined;
    const checkRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${ghToken.trim()}`, Accept: 'application/vnd.github.v3+json' },
    });
    if (checkRes.ok) {
      const existing = await checkRes.json();
      sha = existing.sha;
    }

    const encoded = btoa(unescape(encodeURIComponent(contentText)));
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${ghToken.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: commitMsg,
        content: encoded,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      throw new Error(errData.message || `GitHub API 返回状态 ${putRes.status}`);
    }
    return true;
  };

  // --- Post Handlers ---
  const buildPostMarkdown = () => {
    const today = new Date().toISOString().slice(0, 10);
    const tagsArr = postTags
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean);
    return `---
title: "${postTitle.replace(/"/g, '\\"')}"
date: ${today}
categories: "${postCategory}"
tags:
${tagsArr.map((t) => `  - "${t}"`).join('\n')}
description: "${postDesc.replace(/"/g, '\\"')}"
${postCover ? `cover: "${postCover}"\n` : ''}author: "Larry"
---

${postBody}
`;
  };

  const handlePublishPostViaAPI = async () => {
    if (!postTitle.trim()) return notify('请输入文章标题', 'err');
    setIsPublishing(true);
    try {
      const md = buildPostMarkdown();
      const slug = postTitle
        .trim()
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5-]+/g, '-')
        .replace(/^-|-$/g, '') || `post-${Date.now()}`;

      if (ghToken.trim()) {
        await pushToGitHub(`src/content/posts/${slug}.md`, md, `feat(post): add ${postTitle}`);
        notify(`文章《${postTitle}》已通过 GitHub API 直发仓库，Pages 将自动重新构建！`);
      } else if (webhookUrl.trim()) {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(webhookKey ? { Authorization: `Bearer ${webhookKey}` } : {}),
          },
          body: JSON.stringify({ type: 'post', slug, markdown: md }),
        });
        if (!res.ok) throw new Error(`Webhook 返回 ${res.status}`);
        notify(`文章《${postTitle}》已推送至自定义 API！`);
      } else {
        throw new Error('未配置 GitHub Token 或 Webhook API，请先前往「API 接入」配置，或点击下载 .md 文件');
      }
    } catch (e: any) {
      notify(e.message || '发布失败', 'err');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownloadPostMd = () => {
    if (!postTitle.trim()) return notify('请输入文章标题', 'err');
    const blob = new Blob([buildPostMarkdown()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${postTitle.trim()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Markdown 文件已生成并开始下载');
  };

  // --- Link Handlers ---
  const handleLayoutChange = (layout: string) => {
    setLinkLayout(layout);
    localStorage.setItem('links_layout', layout);
    notify(`友链默认视图已切换为：${layout === 'card' ? '卡片' : layout === 'compact' ? '列表' : '画中画 (80%+)'}`);
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.name.trim() || !newLink.link.trim()) return notify('请填写名称和网址', 'err');
    const updated = [newLink, ...customLinks];
    setCustomLinks(updated);
    localStorage.setItem('custom_links', JSON.stringify(updated));
    setNewLink({ name: '', link: '', avatar: '', descr: '', category: '友情链接' });
    notify(`已添加站点「${newLink.name}」到友链页面！`);
  };

  const removeCustomLink = (idx: number) => {
    const updated = customLinks.filter((_, i) => i !== idx);
    setCustomLinks(updated);
    localStorage.setItem('custom_links', JSON.stringify(updated));
    notify('已移除自定义链接');
  };

  // --- Tool Handlers ---
  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool.label.trim() || !newTool.src.trim()) return notify('请填写工具名称与 URL', 'err');
    const item: CustomTool = {
      id: `custom-${Date.now()}`,
      label: newTool.label.trim(),
      emoji: newTool.emoji.trim() || '🧰',
      desc: newTool.desc.trim() || newTool.src.trim(),
      src: newTool.src.trim(),
      externalUrl: newTool.src.trim(),
      type: 'iframe',
    };
    const updated = [...customTools, item];
    setCustomTools(updated);
    localStorage.setItem('custom_tools', JSON.stringify(updated));
    setNewTool({ label: '', emoji: '🧰', desc: '', src: '' });
    notify(`已添加工具「${item.label}」，可在 /tools 画中画 Tab 查看！`);
  };

  const removeCustomTool = (id: string) => {
    const updated = customTools.filter((t) => t.id !== id);
    setCustomTools(updated);
    localStorage.setItem('custom_tools', JSON.stringify(updated));
    notify('已移除工具');
  };

  // --- Entertain Handlers ---
  const handleAddEntertain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntertain.title.trim() || !newEntertain.link.trim()) return notify('请填写娱乐项名称与 URL', 'err');
    const item: CustomEntertain = {
      id: `ent-${Date.now()}`,
      title: newEntertain.title.trim(),
      emoji: newEntertain.emoji.trim() || '🎮',
      desc: newEntertain.desc.trim() || '自定义娱乐互动页',
      link: newEntertain.link.trim(),
    };
    const updated = [...customEntertain, item];
    setCustomEntertain(updated);
    localStorage.setItem('custom_entertain', JSON.stringify(updated));
    setNewEntertain({ title: '', emoji: '🎮', desc: '', link: '' });
    notify(`已添加娱乐项目「${item.title}」！`);
  };

  const removeCustomEntertain = (id: string) => {
    const updated = customEntertain.filter((e) => e.id !== id);
    setCustomEntertain(updated);
    localStorage.setItem('custom_entertain', JSON.stringify(updated));
    notify('已移除娱乐项目');
  };

  // --- Guestbook ---
  const deleteMessage = (id: number) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem('guestbook_messages', JSON.stringify(updated));
    notify('留言已删除');
  };

  // --- API Config Save ---
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
          全站管理工作台支持管理首页、博客文章、友链、工具、娱乐页与 API 自动发布。
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

  const navTabs: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: '首页与全局', icon: Home },
    { id: 'posts', label: '新增文章', icon: FileText },
    { id: 'links', label: '友链管理', icon: Link2 },
    { id: 'tools', label: '工具箱管理', icon: Wrench },
    { id: 'entertain', label: '娱乐馆管理', icon: Gamepad2 },
    { id: 'guestbook', label: '留言审核', icon: MessageSquare },
    { id: 'api', label: 'API 接入配置', icon: KeyRound },
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
              全站管理与内容发布中心
            </h1>
            <p className="text-xs font-mono text-charcoal-100 dark:text-cream-400">
              Admin: ldd · 支持全页面配置 & GitHub / Webhook API 发布
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

      {/* Toast */}
      {toast && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center gap-2 ${
            toast.type === 'ok'
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/10 border-red-500/25 text-red-500'
          }`}
        >
          {toast.type === 'ok' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {navTabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                active
                  ? 'bg-terracotta text-white border-terracotta shadow-sm'
                  : 'glass border-charcoal-500/10 dark:border-white/10 text-charcoal-200 dark:text-cream-300 hover:border-terracotta/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-6 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 space-y-6">
        {/* 1. HOME & GLOBAL */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <h2 className="font-serif text-lg font-bold">首页视觉与全站环境控制</h2>
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
                  <span className="font-bold text-sm block">左下角同步音乐胶囊</span>
                  <span className="text-xs opacity-60">歌单 ID: 9333187603</span>
                </div>
                <button
                  onClick={toggleMusic}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs ${
                    showMusic ? 'bg-emerald-500/15 text-emerald-500' : 'bg-red-500/15 text-red-500'
                  }`}
                >
                  {showMusic ? '已开启' : '已关闭'}
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-charcoal-500/10 dark:border-white/10">
              <div>
                <label className="block text-xs font-mono mb-1.5">首页默认封面壁纸 URL / 纯色 Hex / 渐变 CSS</label>
                <input
                  type="text"
                  value={heroBgUrl}
                  onChange={(e) => setHeroBgUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... 或 #141413"
                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1.5">首页打字机轮播标语（每行一条）</label>
                <textarea
                  rows={4}
                  value={heroPhrasesText}
                  onChange={(e) => setHeroPhrasesText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono"
                />
              </div>
              <button onClick={saveHeroSettings} className="px-5 py-2 rounded-xl bg-terracotta text-white text-xs font-mono hover:opacity-90">
                保存首页配置
              </button>
            </div>
          </div>
        )}

        {/* 2. ADD POST */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold">撰写与发布新文章 (支持 API 直发)</h2>
              <a href="/posts" className="text-xs font-mono text-terracotta hover:underline">查看博客列表 →</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="文章标题 *"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
              />
              <input
                type="text"
                placeholder="分类 (如：AI 产品、技术随笔)"
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
              />
              <input
                type="text"
                placeholder="标签 (逗号分隔，如: Agent, Prompt)"
                value={postTags}
                onChange={(e) => setPostTags(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
              />
              <input
                type="text"
                placeholder="封面图片 URL (可选，留空自动匹配高清封面)"
                value={postCover}
                onChange={(e) => setPostCover(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
              />
            </div>
            <input
              type="text"
              placeholder="一句话摘要"
              value={postDesc}
              onChange={(e) => setPostDesc(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
            />
            <textarea
              rows={8}
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              placeholder="Markdown 正文..."
              className="w-full p-3.5 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono"
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePublishPostViaAPI}
                disabled={isPublishing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta text-white text-xs font-mono hover:opacity-90 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPublishing ? '发布中...' : '通过 API 一键发布到网站'}</span>
              </button>
              <button
                onClick={handleDownloadPostMd}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-charcoal-500/15 dark:border-white/15 text-xs font-mono"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载 .md 文件</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. LINKS */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-lg font-bold mb-3">友链页面默认布局</h2>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: 'card', name: '🗂️ 卡片网格' },
                  { id: 'compact', name: '📋 紧凑列表' },
                  { id: 'split', name: '🖥️ 画中画模式 (80%+)' },
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

            <form onSubmit={handleAddLink} className="space-y-3 pt-4 border-t border-charcoal-500/10 dark:border-white/10">
              <h3 className="font-bold text-sm">添加新友链 / 导航站点</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="站点名称 *"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
                />
                <input
                  type="url"
                  placeholder="网址 https://... *"
                  value={newLink.link}
                  onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
                />
                <input
                  type="text"
                  placeholder="分类 (如：友情链接、AI工具)"
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
                />
                <input
                  type="text"
                  placeholder="简短描述"
                  value={newLink.descr}
                  onChange={(e) => setNewLink({ ...newLink, descr: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
                />
              </div>
              <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta text-white text-xs font-mono">
                <Plus className="w-3.5 h-3.5" /> 添加到友链导航
              </button>
            </form>

            {customLinks.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-mono opacity-70">已添加的自定义站点 ({customLinks.length})</h4>
                {customLinks.map((l, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-charcoal-500/10 dark:border-white/10 text-xs">
                    <span><strong>{l.name}</strong> ({l.category}) — {l.link}</span>
                    <button onClick={() => removeCustomLink(idx)} className="text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. TOOLS */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <form onSubmit={handleAddTool} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold">添加工具箱画中画 Tab</h2>
                <a href="/tools" className="text-xs font-mono text-terracotta hover:underline">前往工具箱 →</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="工具名称 *"
                  value={newTool.label}
                  onChange={(e) => setNewTool({ ...newTool, label: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
                />
                <input
                  type="text"
                  placeholder="Emoji 图标 (如 🧰)"
                  value={newTool.emoji}
                  onChange={(e) => setNewTool({ ...newTool, emoji: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
                />
                <input
                  type="url"
                  placeholder="内嵌网页 URL https://... *"
                  value={newTool.src}
                  onChange={(e) => setNewTool({ ...newTool, src: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder="工具描述"
                  value={newTool.desc}
                  onChange={(e) => setNewTool({ ...newTool, desc: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm sm:col-span-2"
                />
              </div>
              <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta text-white text-xs font-mono">
                <Plus className="w-3.5 h-3.5" /> 新增工具 Tab
              </button>
            </form>

            {customTools.length > 0 && (
              <div className="space-y-2">
                {customTools.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl border border-charcoal-500/10 dark:border-white/10 text-xs">
                    <span>{t.emoji} <strong>{t.label}</strong> — {t.src}</span>
                    <button onClick={() => removeCustomTool(t.id)} className="text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. ENTERTAIN */}
        {activeTab === 'entertain' && (
          <div className="space-y-6">
            <form onSubmit={handleAddEntertain} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold">添加娱乐馆互动页面</h2>
                <a href="/entertain" className="text-xs font-mono text-terracotta hover:underline">前往娱乐馆 →</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="项目名称 *"
                  value={newEntertain.title}
                  onChange={(e) => setNewEntertain({ ...newEntertain, title: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
                />
                <input
                  type="text"
                  placeholder="Emoji 图标 (如 🎮)"
                  value={newEntertain.emoji}
                  onChange={(e) => setNewEntertain({ ...newEntertain, emoji: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
                />
                <input
                  type="text"
                  placeholder="页面路径或 URL (如 /effects/tetris/index.html) *"
                  value={newEntertain.link}
                  onChange={(e) => setNewEntertain({ ...newEntertain, link: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder="简介"
                  value={newEntertain.desc}
                  onChange={(e) => setNewEntertain({ ...newEntertain, desc: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm sm:col-span-2"
                />
              </div>
              <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta text-white text-xs font-mono">
                <Plus className="w-3.5 h-3.5" /> 添加娱乐项目
              </button>
            </form>

            {customEntertain.length > 0 && (
              <div className="space-y-2">
                {customEntertain.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-charcoal-500/10 dark:border-white/10 text-xs">
                    <span>{item.emoji} <strong>{item.title}</strong> — {item.link}</span>
                    <button onClick={() => removeCustomEntertain(item.id)} className="text-red-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. GUESTBOOK */}
        {activeTab === 'guestbook' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold">留言板审核与维护 ({messages.length})</h2>
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

        {/* 7. API CONFIG */}
        {activeTab === 'api' && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-lg font-bold">API 自动化发布接入配置</h2>
              <p className="text-xs opacity-70 mt-1">
                配置 GitHub Token 后，可在「新增文章」页面直接通过 GitHub Contents API 提交 Markdown 到仓库并自动部署；也可对接自定义 Webhook API。Token 仅保存在您本地浏览器中。
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono mb-1">GitHub 仓库 (owner/repo)</label>
                <input
                  type="text"
                  value={ghRepo}
                  onChange={(e) => setGhRepo(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1">GitHub Personal Access Token</label>
                <input
                  type="password"
                  value={ghToken}
                  onChange={(e) => setGhToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1">自定义 Webhook API Endpoint (可选)</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-api.example.com/publish"
                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1">Webhook Bearer Key (可选)</label>
                <input
                  type="password"
                  value={webhookKey}
                  onChange={(e) => setWebhookKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono"
                />
              </div>
            </div>

            <button onClick={saveApiConfig} className="px-5 py-2.5 rounded-xl bg-terracotta text-white text-xs font-mono hover:opacity-90">
              保存 API 凭证
            </button>

            <div className="p-4 rounded-2xl bg-zinc-950 text-emerald-300 font-mono text-[11px] overflow-x-auto space-y-1">
              <div className="text-white/50"># 外部脚本 / AI Agent 通过 GitHub API 新增文章示例：</div>
              <div>PUT https://api.github.com/repos/{ghRepo}/contents/src/content/posts/my-post.md</div>
              <div>Header: Authorization: token &lt;YOUR_TOKEN&gt;</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
