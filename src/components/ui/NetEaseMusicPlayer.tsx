import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronUp, ExternalLink, Disc } from 'lucide-react';
import { musicStore, PLAYLIST_ID, type Track } from '@/lib/musicStore';

export const NetEaseMusicPlayer: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [state, setState] = useState(musicStore.state);

  useEffect(() => {
    const saved = localStorage.getItem('show_music');
    if (saved === 'false') setIsEnabled(false);
    return musicStore.subscribe((next) => setState(next));
  }, []);

  if (!isEnabled) return null;

  const currentTrack: Track | undefined = state.tracks[state.currentIndex];

  return (
    <div className="fixed bottom-5 left-4 z-40 flex flex-col items-start gap-2.5">
      {/* Expanded Mineradio-style Card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-80 rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900/95 backdrop-blur-2xl text-white"
          >
            {/* Header */}
            <div className="p-4 flex items-center gap-3.5 bg-gradient-to-br from-terracotta/20 via-zinc-900 to-zinc-900 border-b border-white/10">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/15 shadow-lg">
                <img
                  src={currentTrack?.pic}
                  alt={currentTrack?.title}
                  className={`w-full h-full object-cover ${state.isPlaying ? 'animate-spin [animation-duration:12s]' : ''}`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm truncate">{currentTrack?.title || '加载中...'}</div>
                <div className="text-xs text-white/60 truncate mt-0.5">{currentTrack?.author || 'Mineradio 同步'}</div>
                <div className="text-[10px] font-mono text-terracotta mt-1">歌单 ID: {PLAYLIST_ID}</div>
              </div>
              <a
                href="/entertain/music"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="进入 Mineradio 音乐馆"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {state.errorMsg && (
              <div className="px-4 py-1.5 bg-amber-500/15 text-amber-300 text-[10px] font-mono">
                {state.errorMsg}
              </div>
            )}

            {/* Progress Bar */}
            <div className="px-4 pt-3">
              <input
                type="range"
                min={0}
                max={state.duration || 100}
                value={state.currentTime}
                onChange={(e) => musicStore.seek(Number(e.target.value))}
                className="w-full h-1 rounded-full accent-terracotta cursor-pointer"
              />
            </div>

            {/* Playback + Volume */}
            <div className="px-4 py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button onClick={() => musicStore.prev()} className="p-1.5 rounded-lg hover:bg-white/10 text-white/75 hover:text-white transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => musicStore.togglePlay()}
                  className="p-2 rounded-full bg-terracotta hover:bg-terracotta/90 text-white shadow-lg transition-transform active:scale-95"
                >
                  {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button onClick={() => musicStore.next()} className="p-1.5 rounded-lg hover:bg-white/10 text-white/75 hover:text-white transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-1 max-w-[120px]">
                <button onClick={() => musicStore.toggleMute()} className="text-white/60 hover:text-white">
                  {state.isMuted || state.volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={state.isMuted ? 0 : state.volume}
                  onChange={(e) => musicStore.setVolume(Number(e.target.value))}
                  className="w-full h-1 rounded-full accent-terracotta cursor-pointer"
                />
              </div>
            </div>

            {/* Compact Tracklist */}
            <div className="max-h-40 overflow-y-auto border-t border-white/10 divide-y divide-white/5">
              {state.tracks.slice(0, 20).map((t, idx) => (
                <button
                  key={`${t.title}-${idx}`}
                  onClick={() => musicStore.playTrack(idx)}
                  className={`w-full px-4 py-2 text-left flex items-center justify-between text-xs hover:bg-white/8 transition-colors ${
                    idx === state.currentIndex ? 'text-terracotta bg-terracotta/10 font-semibold' : 'text-white/75'
                  }`}
                >
                  <span className="truncate flex-1 pr-2">{idx + 1}. {t.title}</span>
                  <span className="text-[10px] text-white/45 truncate max-w-[80px]">{t.author}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default Capsule: Prev / Play-Pause / Next / Volume / Expand */}
      <div
        style={{ transform: 'scale(var(--pill-scale, 1))', transformOrigin: 'bottom left' }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 dark:bg-black/80 border border-white/15 shadow-2xl backdrop-blur-xl text-white"
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-6 h-6 flex items-center justify-center shrink-0"
          title="展开/收起歌单"
        >
          <Disc className={`w-5 h-5 text-terracotta ${state.isPlaying ? 'animate-spin [animation-duration:4s]' : ''}`} />
        </button>

        <button onClick={() => musicStore.prev()} className="p-1 rounded-full hover:bg-white/10 text-white/75 hover:text-white transition-colors" title="上一曲">
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => musicStore.togglePlay()}
          className="p-1.5 rounded-full bg-terracotta/90 hover:bg-terracotta text-white transition-transform active:scale-95"
          title={state.isPlaying ? '暂停' : '播放'}
        >
          {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <button onClick={() => musicStore.next()} className="p-1 rounded-full hover:bg-white/10 text-white/75 hover:text-white transition-colors" title="下一曲">
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button onClick={() => musicStore.toggleMute()} className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors" title="静音/取消静音">
          {state.isMuted || state.volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden sm:flex items-center gap-1.5 pl-1 pr-1.5 text-xs text-white/80 hover:text-white max-w-[130px] truncate"
          title="展开歌单详情"
        >
          <span className="truncate">{currentTrack?.title || "Mineradio"}</span>
          <ChevronUp className={`w-3.5 h-3.5 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
