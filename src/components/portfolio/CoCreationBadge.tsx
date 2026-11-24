import React from 'react';
import { Bot, UserCheck, Sparkles } from 'lucide-react';

interface CoCreationBadgeProps {
  humanShare?: number; // e.g., 30
  aiShare?: number;    // e.g., 70
  models?: string[];   // e.g., ['Claude 3.5 Sonnet', 'Cursor']
}

export const CoCreationBadge: React.FC<CoCreationBadgeProps> = ({
  humanShare = 30,
  aiShare = 70,
  models = ['Claude 3.5 Sonnet'],
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {/* Collaboration Bar Badge */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-200/80 dark:bg-obsidian-border text-charcoal-200 dark:text-cream-300 border border-charcoal-500/10 dark:border-white/10">
        <span className="flex items-center gap-1 text-charcoal-DEFAULT dark:text-cream-100 font-medium">
          <UserCheck className="w-3.5 h-3.5 text-terracotta" />
          {humanShare}%
        </span>
        <span className="text-charcoal-100 dark:text-cream-400">/</span>
        <span className="flex items-center gap-1 text-charcoal-DEFAULT dark:text-cream-100 font-medium">
          <Bot className="w-3.5 h-3.5 text-amber-500" />
          {aiShare}%
        </span>
      </div>

      {/* Model Tag */}
      {models.map((model) => (
        <span
          key={model}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-terracotta-50 dark:bg-terracotta-900/20 text-terracotta-600 dark:text-terracotta-300 border border-terracotta-200/50 dark:border-terracotta-700/30 font-mono text-[11px]"
        >
          <Sparkles className="w-3 h-3" />
          {model}
        </span>
      ))}
    </div>
  );
};
