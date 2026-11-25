import React, { useState, useEffect } from 'react';
import { PenSquare, X, Send, Download, Check, AlertCircle } from 'lucide-react';

export const QuickPostButton: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI 产品');
  const [tags, setTags] = useState('AI, 产品思考');
  const [desc, setDesc] = useState('');
  const [cover, setCover] = useState('');
  const [body, setBody] = useState('## 背景\n\n## 核心思路\n\n## 总结\n');
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('admin_authenticated') === 'true');
  }, []);

  if (!isAdmin) return null;

  const buildMarkdown = () => {
    const today = new Date().toISOString().slice(0, 10);
    const tagsArr = tags
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean);
    return `---
title: "${title.replace(/"/g, '\\"')}"
date: ${today}
categories: "${category}"
tags:
${tagsArr.map((t) => `  - "${t}"`).join('\n')}
description: "${desc.replace(/"/g, '\\"')}"
${cover ? `cover: "${cover}"\n` : ''}author: "Larry"
---

${body}
`;
  };

  const handlePublishAPI = async () => {
    if (!title.trim()) return setStatus({ type: 'err', msg: '请输入文章标题' });
    const ghToken = localStorage.getItem('admin_gh_token') || '';
    const ghRepo = localStorage.getItem('admin_gh_repo') || 'ClawRere/ClawRere.github.io';
    const webhookUrl = localStorage.getItem('admin_webhook_url') || '';
    const webhookKey = localStorage.getItem('admin_webhook_key') || '';

    setIsPublishing(true);
    setStatus(null);
    try {
      const md = buildMarkdown();
      const slug =
        title
          .trim()
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5-]+/g, '-')
          .replace(/^-|-$/g, '') || `post-${Date.now()}`;

      if (ghToken.trim()) {
        const apiUrl = `https://api.github.com/repos/${ghRepo}/contents/src/content/posts/${slug}.md`;
        const encoded = btoa(unescape(encodeURIComponent(md)));
        const res = await fetch(apiUrl, {
          method: 'PUT',
          headers: { Authorization: `token ${ghToken.trim()}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `feat(post): add ${title}`, content: encoded }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `GitHub API 错误 (${res.status})`);
        }
        setStatus({ type: 'ok', msg: `已通过 GitHub API 直发仓库，Pages 将自动重新构建！` });
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
        setStatus({ type: 'ok', msg: '已推送至自定义 API！' });
      } else {
        throw new Error('未配置 API Token，请前往「管理中心 → API 接入配置」填写，或直接下载 .md 文件');
      }
    } catch (e: any) {
      setStatus({ type: 'err', msg: e.message || '发布失败' });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownload = () => {
    if (!title.trim()) return setStatus({ type: 'err', msg: '请输入文章标题' });
    const blob = new Blob([buildMarkdown()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.trim()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus({ type: 'ok', msg: 'Markdown 文件已下载' });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta hover:bg-terracotta/90 text-white text-xs font-mono font-semibold shadow-lg transition-all"
      >
        <PenSquare className="w-3.5 h-3.5" />
        <span>写新文章</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-charcoal-DEFAULT dark:text-white">✍️ 撰写并发布新文章</h3>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            {status && (
              <div
                className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                  status.type === 'ok' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                }`}
              >
                {status.type === 'ok' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{status.msg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="文章标题 *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
              />
              <input
                type="text"
                placeholder="分类"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
              />
              <input
                type="text"
                placeholder="标签 (逗号分隔)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
              />
              <input
                type="text"
                placeholder="封面图 URL (可选)"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
              />
            </div>

            <input
              type="text"
              placeholder="一句话摘要"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-sm"
            />

            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono"
            />

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePublishAPI}
                disabled={isPublishing}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-terracotta text-white text-xs font-mono font-semibold hover:opacity-90"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPublishing ? '发布中...' : 'API 一键发布'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/15 text-xs font-mono"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载 .md</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
