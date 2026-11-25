import React from 'react';
import { motion } from 'framer-motion';
import { Home, Briefcase, BookOpen, Gamepad2, Wrench, Link2, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: '首页', href: '/', icon: Home },
  { name: '作品集', href: '/portfolio', icon: Briefcase },
  { name: '博客', href: '/posts', icon: BookOpen },
  { name: '娱乐馆', href: '/entertain', icon: Gamepad2 },
  { name: '工具箱', href: '/tools', icon: Wrench },
  { name: '友链', href: '/links', icon: Link2 },
  { name: '关于', href: '/about', icon: User },
];

interface FloatingDockProps {
  currentPath?: string;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({ currentPath = '/' }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[95vw]">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="glass-pill px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-apple-glass flex items-center gap-0.5 sm:gap-1.5 border border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/70 dark:bg-black/60"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? currentPath === '/'
              : currentPath.startsWith(item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              className="relative px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors duration-200 group"
              title={item.name}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDockIndicator"
                  className="absolute inset-0 bg-terracotta/15 dark:bg-terracotta/25 rounded-full border border-terracotta/40"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={`w-4 h-4 z-10 transition-colors ${
                  isActive
                    ? 'text-terracotta'
                    : 'text-charcoal-100 dark:text-cream-400 group-hover:text-terracotta'
                }`}
              />
              <span
                className={`hidden md:inline z-10 text-xs ${
                  isActive
                    ? 'text-terracotta font-semibold'
                    : 'text-charcoal-200 dark:text-cream-300'
                }`}
              >
                {item.name}
              </span>
            </a>
          );
        })}

        <div className="w-[1px] h-4 bg-charcoal-500/10 dark:bg-white/10 mx-0.5 sm:mx-1" />
        <ThemeToggle />
      </motion.nav>
    </div>
  );
};
