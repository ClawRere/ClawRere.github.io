import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc, ChevronUp, ExternalLink, Music } from 'lucide-react';

const PLAYLIST_ID = '9333187603';

export const NetEaseMusicPlayer: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('show_music');
    if (saved === 'false') setIsEnabled(false);
  }, []);

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-5 left-4 z-40 flex flex-col items-start gap-2.5">
      {/* Expanded Official NetEase Playlist Card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-[340px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900/95 backdrop-blur-2xl text-white"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-terracotta" />
                <span className="text-xs font-semibold">网易云音乐随身听 · 免费歌单</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/entertain/music"
                  className="text-[11px] font-mono text-terracotta hover:underline flex items-center gap-1"
                  title="进入音乐馆"
                >
                  音乐馆 <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white/50 hover:text-white transition-colors"
                  title="收起"
                >
                  <ChevronUp className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>

            <div className="bg-white">
              <iframe
                frameBorder="no"
                marginWidth={0}
                marginHeight={0}
                width="340"
                height="320"
                src={`https://music.163.com/outchain/player?type=0&id=${PLAYLIST_ID}&auto=0&height=300`}
                title="网易云音乐播放器"
                className="block w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleek Capsule Pill */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{ transform: 'scale(var(--pill-scale, 1))', transformOrigin: 'bottom left' }}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-zinc-900/90 dark:bg-black/80 border border-white/15 shadow-2xl backdrop-blur-xl text-white hover:border-terracotta/50 transition-all group"
        title={isExpanded ? '收起音乐播放器' : '展开网易云音乐播放器'}
      >
        <Disc className="w-4 h-4 text-terracotta animate-spin [animation-duration:6s]" />
        <div className="flex items-end gap-0.5 h-3">
          <span className="w-0.5 rounded-full bg-terracotta animate-pulse h-2" />
          <span className="w-0.5 rounded-full bg-terracotta animate-pulse h-3" />
          <span className="w-0.5 rounded-full bg-terracotta animate-pulse h-1.5" />
        </div>
        <span className="text-xs font-medium text-white/85 group-hover:text-white">
          {isExpanded ? '收起播放器' : '网易云音乐馆'}
        </span>
        <ChevronUp className={`w-3.5 h-3.5 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </motion.button>
    </div>
  );
};
