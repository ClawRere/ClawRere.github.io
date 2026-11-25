import React, { useState, useEffect } from 'react';
import { Lock, User, KeyRound, Check, AlertCircle, LogOut } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin credentials
    if ((username === 'ldd' || username === 'admin') && password === 'ldd534') {
      localStorage.setItem('admin_authenticated', 'true');
      setIsAdmin(true);
      setSuccess('登录成功！正在跳转至管理工作台...');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 800);
    } else {
      setError('用户名或密码有误，请核对后重试');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAdmin(false);
    setSuccess('已退出管理员登录状态');
  };

  if (isAdmin) {
    return (
      <div className="p-8 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 text-center space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <Check className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-DEFAULT dark:text-cream-50">
          已处于站长管理登录状态
        </h2>
        <p className="text-xs text-charcoal-100 dark:text-cream-400">
          您当前拥有系统设置、动效开关、布局偏好调整与留言管理权限。
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <a
            href="/admin"
            className="px-5 py-2.5 rounded-full bg-terracotta text-white text-xs font-mono font-medium hover:bg-terracotta-500 transition-colors shadow-glow-terracotta"
          >
            进入管理工作台
          </a>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-full glass text-xs font-mono text-charcoal-DEFAULT dark:text-cream-100 hover:bg-red-500 hover:text-white transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-3xl glass border border-charcoal-500/10 dark:border-white/10 max-w-md mx-auto shadow-2xl bg-white/70 dark:bg-black/40">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-DEFAULT dark:text-cream-50">
          系统管理中心登录
        </h2>
        <p className="text-xs text-charcoal-100 dark:text-cream-400 mt-1">
          普通访客无需登录即可浏览全站内容；登录后可调整动效、布局及管理留言。
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-charcoal-200 dark:text-cream-300 mb-1.5">
            管理员账号 (Username)
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-100 dark:text-cream-400 pointer-events-none" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入账号 (默认: ldd)"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-charcoal-200 dark:text-cream-300 mb-1.5">
            管理密码 (Password)
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-100 dark:text-cream-400 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass text-xs sm:text-sm text-charcoal-DEFAULT dark:text-cream-50 focus:outline-none focus:border-terracotta/50"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-500 text-white font-mono text-xs font-medium shadow-glow-terracotta transition-all mt-2"
        >
          立即验证并登录
        </button>
      </form>
    </div>
  );
};
