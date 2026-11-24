import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThinkingAccordionProps {
  title?: string;
  duration?: string;
  children: React.ReactNode;
  className?: string;
}

export const ThinkingAccordion: React.FC<ThinkingAccordionProps> = ({
  title = 'AI 思考与架构决策过程 (Co-creation Thought)',
  duration = '5s',
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        'rounded-xl border border-charcoal-500/10 dark:border-white/10 bg-cream-100/60 dark:bg-obsidian-card/60 overflow-hidden my-4',
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left text-xs sm:text-sm font-medium text-charcoal-200 dark:text-cream-300 hover:text-charcoal-DEFAULT dark:hover:text-cream-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-terracotta" />
          <span>{title}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-cream-300/40 dark:bg-obsidian-border text-charcoal-100 dark:text-cream-400 font-mono">
            {duration}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-charcoal-100 dark:text-cream-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-4 py-3 border-t border-charcoal-500/10 dark:border-white/10 text-xs sm:text-sm text-charcoal-100 dark:text-cream-300 font-mono leading-relaxed bg-cream-200/30 dark:bg-black/20">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
