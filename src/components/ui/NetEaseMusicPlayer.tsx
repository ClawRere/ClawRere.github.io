import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc, ChevronUp, ExternalLink, Music } from 'lucide-react';

export const NETEASE_PLAYLISTS = [
  { id: '9333187603', name: '免费精选歌单', desc: '全曲目免费可播' },
  { id: '901594222', name: '磊大大私藏', desc: '原博客经典歌单' },
  { id: '711502311', name: '专注轻音乐', desc: '编码与思考伴奏' },
  { id: '3778678', name: '网易云热歌榜', desc: '每周热门流行' },
  { id: '2884035', name: '网易云原创榜', desc: '独立音乐人佳作' },
];

export const NetEaseMusicPlayer: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [playlistId, setPlaylistId] = useState<string>('9333187603');

  useEffect(() => {
    if (localStorage.getItem('show_music') === 'false') setIsEnabled(false);
    const savedId = localStorage.getItem('selected_playlist_id');
    if (savedId) setPlaylistId(savedId);

    const onPlaylistChanged = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) setPlaylistId(id);
    };
    window.addEventListener('playlist-changed', onPlaylistChanged);
    return () => window.removeEventListener('playlist-changed', onPlaylistChanged);
  }, []);

  const switchPlaylist = (id: string) => {
    setPlaylistId(id);
    localStorage.setItem('selected_playlist_id', id);
    window.dispatchEvent(new CustomEvent('playlist-changed', { detail: id }));
  };

  if (!isEnabled) return null;

  const currentPlaylist = NETEASE_PLAYLISTS.find((p) => p.id === playlistId) || NETEASE_PLAYLISTS[0];

  return (
    <div className="fixed bottom-5 left-4 z-40 flex flex-col items-start gap-2.5">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-[340px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-900/95 backdrop-blur-2xl text-white"
          >
            {/* Mineradio-style Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-terracotta" />
                <span className="text-xs font-semibold">{currentPlaylist.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/entertain/music"
                  className="text-[11px] font-mono text-terracotta hover:underline flex items-center gap-1"
                >
                  音乐馆 <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <ChevronUp className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>

            {/* Selectable Playlists Strip */}
            <div className="flex gap-1.5 overflow-x-auto px-3 py-2 border-b border-white/10 scrollbar-none">
              {NETEASE_PLAYLISTS.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => switchPlaylist(pl.id)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all ${
                    pl.id === playlistId
                      ? 'bg-terracotta text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {pl.name}
                </button>
              ))}
            </div>

            {/* Official NetEase Outer Player */}
            <div className="bg-white">
              <iframe
                key={playlistId}
                frameBorder="no"
                marginWidth={0}
                marginHeight={0}
                width="340"
                height="320"
                src={`https://music.163.com/outchain/player?type=0&id=${playlistId}&auto=0&height=300`}
                title="网易云音乐官方播放器"
                className="block w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mineradio-style Capsule Pill */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{ transform: 'scale(var(--pill-scale, 1))', transformOrigin: 'bottom left' }}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-zinc-900/90 dark:bg-black/80 border border-white/15 shadow-2xl backdrop-blur-xl text-white hover:border-terracotta/50 transition-all group"
      >
        <Disc className="w-4 h-4 text-terracotta animate-spin [animation-duration:6s]" />
        <div className="flex items-end gap-0.5 h-3">
          <span className="w-0.5 rounded-full bg-terracotta animate-pulse h-2" />
          <span className="w-0.5 rounded-full bg-terracotta animate-pulse h-3" />
          <span className="w-0.5 rounded-full bg-terracotta animate-pulse h-1.5" />
        </div>
        <span className="text-xs font-medium text-white/90">
          {isExpanded ? '收起电台' : currentPlaylist.name}
        </span>
        <ChevronUp className={`w-3.5 h-3.5 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </motion.button>
    </div>
  );
};
