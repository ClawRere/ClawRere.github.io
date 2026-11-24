import React from 'react';
import { motion } from 'framer-motion';
import { Home, Briefcase, BookOpen, Sparkles, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: '首页', href: '/', icon: Home },
  { name: '作品集', href: '/portfolio', icon: Briefcase },
  { name: '知识库', href: '/posts', icon: BookOpen },
  { name: '实验室', href: '/effects', icon: Sparkles },
  { name: '关于', href: '/about', icon: User },
];

interface FloatingDockProps {
  currentPath?: string;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({ currentPath = '/' }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="glass-pill px-3 py-2 rounded-full shadow-apple-glass flex items-center gap-1 sm:gap-2"
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
              className="relative px-3 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="activeDockIndicator"
                  className="absolute inset-0 bg-terracotta/10 dark:bg-terracotta/20 rounded-full border border-terracotta/30"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={`w-4 h-4 z-10 transition-colors ${
                  isActive
                    ? 'text-terracotta'
                    : 'text-charcoal-100 dark:text-cream-400 group-hover:text-charcoal'
                }`}
              />
              <span
                className={`hidden sm:inline z-10 ${
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

        <div className="w-[1px] h-4 bg-charcoal-500/10 dark:bg-white/10 mx-1" />
        <ThemeToggle />
      </motion.nav>
    </div>
  );
};
