import React, { useState } from 'react';
import { Terminal, Eye, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface PromptCompareProps {
  prompt: string;
  outputSummary: string;
  demoComponent?: React.ReactNode;
}

export const PromptCompare: React.FC<PromptCompareProps> = ({
  prompt,
  outputSummary,
  demoComponent,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'result'>('result');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-charcoal-500/10 dark:border-white/10 glass overflow-hidden my-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-charcoal-500/10 dark:border-white/10 bg-cream-100/50 dark:bg-obsidian-card">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('result')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'result'
                ? 'bg-white dark:bg-obsidian-border text-charcoal-DEFAULT dark:text-cream-100 shadow-sm'
                : 'text-charcoal-100 dark:text-cream-400 hover:text-charcoal'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-terracotta" />
            共创成效 (Result)
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'prompt'
                ? 'bg-white dark:bg-obsidian-border text-charcoal-DEFAULT dark:text-cream-100 shadow-sm'
                : 'text-charcoal-100 dark:text-cream-400 hover:text-charcoal'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-500" />
            人机提示词 (Prompt)
          </button>
        </div>

        {activeTab === 'prompt' && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-charcoal-100 dark:text-cream-400 hover:text-terracotta transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>复制 Prompt</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6">
        {activeTab === 'prompt' ? (
          <pre className="font-mono text-xs sm:text-sm text-charcoal-200 dark:text-cream-200 whitespace-pre-wrap leading-relaxed bg-cream-200/40 dark:bg-black/30 p-4 rounded-xl border border-charcoal-500/5 dark:border-white/5">
            {prompt}
          </pre>
        ) : (
          <div>
            <p className="text-sm text-charcoal-100 dark:text-cream-300 mb-4 leading-relaxed">
              {outputSummary}
            </p>
            {demoComponent && (
              <div className="mt-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-charcoal-500/10 dark:border-white/10">
                {demoComponent}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
