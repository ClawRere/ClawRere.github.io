import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, Calendar, Check, AlertCircle } from 'lucide-react';

interface CommentItem {
  id: number;
  name: string;
  contact?: string;
  content: string;
  date: string;
  isAdmin?: boolean;
}

const initialMessages: CommentItem[] = [
  {
    id: 1,
    name: '小N同学',
    content: '磊大大的网站升级后动效太丝滑了！PMOS 产品模型很有启发，期待后续商业化演进！',
    date: '2026-11-20',
  },
  {
    id: 2,
    name: 'Hexo极客',
    content: '93+ 原生动效用沙盒运行体验太赞了，尤其是海底泡泡和飞机大战！已加书签。',
    date: '2026-11-22',
  },
  {
    id: 3,
    name: 'Larry (站长)',
    content: '欢迎来到我的数字花园！有任何关于 AI 工具、PMOS 产品或技术交流的想法，欢迎随时在此留言互动。',
    date: '2026-11-23',
    isAdmin: true,
  },
];

export const MessageBoard: React.FC = () => {
  const [messages, setMessages] = useState<CommentItem[]>(initialMessages);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [content, setContent] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('guestbook_messages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

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
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem('guestbook_messages', JSON.stringify(updated));

    setName('');
    setContact('');
    setContent('');
    setToast('留言发布成功！');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 relative overflow-hidden bg-gradient-to-br from-cream-100/60 to-terracotta-50/20 dark:from-obsidian-card dark:to-obsidian">
        <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">
          <MessageSquare className="w-4 h-4" />
          Community Guestbook
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-DEFAULT dark:text-cream-50">
          温暖留言板与友链交流
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-charcoal-100 dark:text-cream-300 leading-relaxed font-serif">
          欢迎在此写下你的想法、意见反馈或交换友链。所有访客均可自由留言，管理员可在后台审核与回复。
        </p>
      </div>

      {/* 2. Message Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 space-y-4 shadow-xl">
        <h2 className="font-serif text-lg font-bold text-charcoal-DEFAULT dark:text-cream-50 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-terracotta" />
          留下你的足迹
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-charcoal-200 dark:text-cream-300 mb-1">
              昵称 (Name) *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="您的称呼"
              required
              className="w-full px-3.5 py-2 rounded-xl glass text-xs text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta/50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-charcoal-200 dark:text-cream-300 mb-1">
              联系方式/网址 (可选)
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="邮箱或个人网站"
              className="w-full px-3.5 py-2 rounded-xl glass text-xs text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-charcoal-200 dark:text-cream-300 mb-1">
            留言内容 (Message) *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="写下你想对磊大大说的话、交流心得或申请友链..."
            required
            className="w-full px-3.5 py-2.5 rounded-xl glass text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta/50"
          />
        </div>

        {toast && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-terracotta text-white font-mono text-xs font-medium hover:bg-terracotta-500 shadow-glow-terracotta transition-all hover:scale-105"
          >
            <Send className="w-3.5 h-3.5" />
            <span>发送留言</span>
          </button>
        </div>
      </form>

      {/* 3. Messages List */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-DEFAULT dark:text-cream-50">
          留言列表 ({messages.length})
        </h3>

        <div className="space-y-3">
          {messages.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl glass border ${
                item.isAdmin ? 'border-terracotta/30 bg-terracotta/5 dark:bg-terracotta/10' : 'border-charcoal-500/10 dark:border-white/10'
              } space-y-2`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-charcoal-DEFAULT dark:text-cream-50">
                    {item.name}
                  </span>
                  {item.isAdmin && (
                    <span className="px-2 py-0.5 rounded-full bg-terracotta text-white text-[10px] font-mono">
                      站长
                    </span>
                  )}
                  {item.contact && (
                    <span className="text-charcoal-100 dark:text-cream-400 opacity-70">
                      ({item.contact})
                    </span>
                  )}
                </div>

                <span className="text-charcoal-100 dark:text-cream-400 text-[11px]">
                  {item.date}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-charcoal-200 dark:text-cream-200 leading-relaxed font-sans">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
