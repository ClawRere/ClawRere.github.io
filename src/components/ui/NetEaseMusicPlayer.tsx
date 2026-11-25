import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, ChevronUp, ChevronDown, Volume2, Disc, ExternalLink } from 'lucide-react';

export const NetEaseMusicPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // User's NetEase playlist ID from Hexo
  const playlistId = '901594222';

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* 1. Minimized Floating Vinyl Pill */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full glass-pill border border-terracotta/30 shadow-apple-glass text-xs font-mono text-charcoal-DEFAULT dark:text-cream-100 group"
          title="展开网易云音乐馆"
        >
          {/* Rotating vinyl icon */}
          <div className="relative w-5 h-5 flex items-center justify-center">
            <Disc className="w-5 h-5 text-terracotta animate-spin [animation-duration:6s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-cream-50 dark:bg-obsidian absolute" />
          </div>

          <span className="hidden sm:inline font-medium">音乐馆 (Larry's Playlist)</span>

          {/* Equalizer sound waves */}
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 bg-terracotta rounded-full animate-sound-1" />
            <span className="w-0.5 bg-terracotta rounded-full animate-sound-2" />
            <span className="w-0.5 bg-terracotta rounded-full animate-sound-3" />
          </div>
        </motion.button>
      )}

      {/* 2. Expanded Floating Music Player Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-80 sm:w-96 rounded-3xl glass p-4 shadow-2xl border border-charcoal-500/10 dark:border-white/10 flex flex-col bg-cream-50/95 dark:bg-obsidian/95 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-500/10 dark:border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-terracotta" />
                <span className="font-serif font-bold text-xs text-charcoal-DEFAULT dark:text-cream-50">
                  网易云音乐随身听
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-terracotta/10 text-terracotta">
                  歌单: {playlistId}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href={`https://music.163.com/#/playlist?id=${playlistId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-charcoal-100 hover:text-terracotta text-xs"
                  title="在网易云音乐打开"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-charcoal-100 hover:text-charcoal"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* NetEase Official Web Embed Player */}
            <div className="w-full h-24 rounded-2xl overflow-hidden border border-charcoal-500/10 dark:border-white/10 bg-black/5">
              <iframe
                frameBorder="no"
                border="0"
                marginWidth="0"
                marginHeight="0"
                width="100%"
                height="86"
                src={`https://music.163.com/outchain/player?type=0&id=${playlistId}&auto=0&height=66`}
                title="网易云歌单"
              />
            </div>

            {/* Quick Link to Entertainment Room */}
            <div className="mt-3 pt-2 border-t border-charcoal-500/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-charcoal-100 dark:text-cream-400">陪你度过代码与创作时光</span>
              <a href="/entertain/music" className="text-terracotta hover:underline">
                进入全屏音乐馆 →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
