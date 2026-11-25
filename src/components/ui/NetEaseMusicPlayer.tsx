import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronUp, ExternalLink, Disc, List } from 'lucide-react';

export const NetEaseMusicPlayer: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const playlistId = '901594222';
  const iframeUrl = `https://music.163.com/outchain/player?type=1&id=${playlistId}&auto=0&height=66`;

  useEffect(() => {
    const saved = localStorage.getItem('show_music');
    if (saved === 'false') setIsEnabled(false);
  }, []);

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-6 left-4 z-40 flex flex-col items-start gap-2">
      {/* Expanded card: show iframe + controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-80 rounded-2xl overflow-hidden border border-white/10 dark:border-white/10 shadow-2xl bg-zinc-900/95 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <Disc className="w-4 h-4 text-terracotta animate-spin [animation-duration:4s]" />
                <span className="text-sm font-semibold text-white">网易云音乐馆</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://music.163.com/#/playlist?id=${playlistId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                  title="在网易云打开歌单"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => setIsExpanded(false)} className="text-white/40 hover:text-white transition-colors">
                  <ChevronUp className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>

            {/* Embedded player */}
            <div className="relative">
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                width="320"
                height="66"
                frameBorder="no"
                className="block w-full"
                title="网易云音乐播放器"
                allow="autoplay"
              />
            </div>

            {/* Volume row */}
            <div className="flex items-center gap-3 px-4 py-3 border-t border-white/8">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-white/50 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false); }}
                className="flex-1 h-1 rounded-full accent-terracotta cursor-pointer"
              />
              <span className="text-[10px] font-mono text-white/30 w-6">{isMuted ? 0 : volume}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Capsule pill - always visible */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 dark:bg-black/70 border border-white/15 shadow-xl backdrop-blur-xl hover:border-terracotta/40 transition-all group"
        title={isExpanded ? '收起音乐播放器' : '展开音乐播放器'}
      >
        {/* Rotating vinyl */}
        <div className="relative w-5 h-5 flex-shrink-0">
          <Disc className="w-5 h-5 text-terracotta animate-spin [animation-duration:5s]" />
          <span className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-zinc-900" />
        </div>

        {/* Sound bars animation */}
        <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
          <span className="w-0.5 rounded-full bg-terracotta/80 animate-[sound1_0.9s_ease-in-out_infinite]" style={{ height: '60%' }} />
          <span className="w-0.5 rounded-full bg-terracotta/80 animate-[sound2_0.7s_ease-in-out_infinite]" style={{ height: '100%' }} />
          <span className="w-0.5 rounded-full bg-terracotta/80 animate-[sound3_1.1s_ease-in-out_infinite]" style={{ height: '40%' }} />
        </div>

        <span className="hidden sm:block text-xs font-medium text-white/70 group-hover:text-white transition-colors">
          {isExpanded ? '收起' : "Larry's Playlist"}
        </span>

        <ChevronUp className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`} />
      </motion.button>
    </div>
  );
};
