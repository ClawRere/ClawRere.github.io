import React, { useState, useEffect } from 'react';
import { Disc, ChevronUp, ExternalLink, Radio } from 'lucide-react';
import { NETEASE_PLAYLISTS } from '@/lib/musicStore';

export { NETEASE_PLAYLISTS };

export const NetEaseMusicPlayer: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [playlistId, setPlaylistId] = useState(NETEASE_PLAYLISTS[0].id);

  useEffect(() => {
    if (localStorage.getItem('show_music') === 'false') setIsEnabled(false);
    const saved = localStorage.getItem('larry_netease_playlist_id');
    if (saved && NETEASE_PLAYLISTS.some((p) => p.id === saved)) {
      setPlaylistId(saved);
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'larry_netease_playlist_id' && e.newValue) {
        setPlaylistId(e.newValue);
      }
    };
    const onCustom = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) setPlaylistId(id);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('larry-playlist-change', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('larry-playlist-change', onCustom);
    };
  }, []);

  if (!isEnabled) return null;

  const currentPlaylist = NETEASE_PLAYLISTS.find((p) => p.id === playlistId) || NETEASE_PLAYLISTS[0];

  const handleSelectPlaylist = (id: string) => {
    setPlaylistId(id);
    localStorage.setItem('larry_netease_playlist_id', id);
    window.dispatchEvent(new CustomEvent('larry-playlist-change', { detail: id }));
  };

  return (
    <div className="fixed bottom-5 left-4 z-40 flex flex-col items-start gap-2.5">
      {/* Keep official NetEase iframe mounted when collapsed so playback persists across collapse & page navigation */}
      <div
        className={`w-[330px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-950/95 backdrop-blur-2xl text-white transition-all duration-300 origin-bottom-left ${
          isExpanded
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none h-0 border-0 shadow-none'
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
            <span className="text-xs font-bold truncate">网易云官方电台 · {currentPlaylist.name}</span>
          </div>
          <a
            href="/entertain/music"
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-blue-400 transition-colors shrink-0"
            title="前往音乐馆"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Playlist Switcher */}
        <div className="flex gap-1.5 overflow-x-auto px-3 py-2 border-b border-white/10 scrollbar-none">
          {NETEASE_PLAYLISTS.map((pl) => (
            <button
              key={pl.id}
              onClick={() => handleSelectPlaylist(pl.id)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all ${
                pl.id === playlistId
                  ? 'bg-rose-500 text-white font-semibold shadow-sm'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {pl.name}
            </button>
          ))}
        </div>

        {/* Official NetEase Outchain Player */}
        <div className="p-2 bg-zinc-900/80">
          <div className="rounded-xl overflow-hidden bg-white shadow-inner">
            <iframe
              key={playlistId}
              frameBorder="no"
              width="100%"
              height="220"
              src={`https://music.163.com/outchain/player?type=0&id=${playlistId}&auto=0&height=200`}
              title="网易云音乐官方外链播放器"
              className="block w-full"
            />
          </div>
        </div>
      </div>

      {/* Sleek Capsule Trigger */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ transform: 'scale(var(--pill-scale, 1))', transformOrigin: 'bottom left' }}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-white/15 shadow-2xl backdrop-blur-xl text-white transition-all active:scale-95"
        title="展开/收起网易云官方播放器"
      >
        <Disc className="w-4 h-4 text-rose-400 animate-spin [animation-duration:6s] shrink-0" />
        <span className="text-xs font-medium tracking-wide">
          {currentPlaylist.name}
        </span>
        <span className="hidden sm:inline text-[10px] font-mono text-white/45">网易云</span>
        <ChevronUp className={`w-3.5 h-3.5 text-white/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
