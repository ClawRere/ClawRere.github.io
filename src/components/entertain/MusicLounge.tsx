import React, { useState, useEffect } from 'react';
import { Disc, ExternalLink, ListMusic, Radio, Sparkles } from 'lucide-react';
import { NETEASE_PLAYLISTS } from '@/lib/musicStore';

export const MusicLounge: React.FC = () => {
  const [playlistId, setPlaylistId] = useState(NETEASE_PLAYLISTS[0].id);

  useEffect(() => {
    const saved = localStorage.getItem('larry_netease_playlist_id');
    if (saved && NETEASE_PLAYLISTS.some((p) => p.id === saved)) {
      setPlaylistId(saved);
    }
    const onCustom = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) setPlaylistId(id);
    };
    window.addEventListener('larry-playlist-change', onCustom);
    return () => window.removeEventListener('larry-playlist-change', onCustom);
  }, []);

  const currentPlaylist = NETEASE_PLAYLISTS.find((p) => p.id === playlistId) || NETEASE_PLAYLISTS[0];

  const handleSelectPlaylist = (id: string) => {
    setPlaylistId(id);
    localStorage.setItem('larry_netease_playlist_id', id);
    window.dispatchEvent(new CustomEvent('larry-playlist-change', { detail: id }));
  };

  return (
    <div className="space-y-6">
      {/* Dark Frosted Glass Console Header */}
      <div className="relative rounded-3xl border border-white/15 bg-zinc-950/90 backdrop-blur-2xl text-white overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/25 to-purple-500/20 border border-white/15 flex items-center justify-center shadow-lg shrink-0">
              <Disc className="w-8 h-8 text-rose-400 animate-spin [animation-duration:8s]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 text-[11px] font-mono border border-rose-500/25 mb-2">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>网易云音乐官方外链 · 稳定直连</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                {currentPlaylist.name}
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1">{currentPlaylist.desc}</p>
            </div>
          </div>

          <a
            href={`https://music.163.com/#/playlist?id=${playlistId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-bold shadow-lg transition-all hover:scale-105 shrink-0"
          >
            <span>在网易云音乐打开</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Playlist Selector Bar */}
        <div className="relative z-10 px-6 sm:px-8 py-4 border-t border-white/10 flex flex-wrap items-center gap-2 bg-black/25">
          <span className="text-xs font-mono text-white/50 flex items-center gap-1.5 mr-1">
            <ListMusic className="w-3.5 h-3.5" /> 精选歌单：
          </span>
          {NETEASE_PLAYLISTS.map((pl) => (
            <button
              key={pl.id}
              onClick={() => handleSelectPlaylist(pl.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                pl.id === playlistId
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
              }`}
            >
              {pl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Styled Official NetEase Outchain Container */}
      <div className="rounded-3xl p-3 sm:p-4 border border-charcoal-500/15 dark:border-white/12 bg-gradient-to-br from-zinc-900/95 via-zinc-950/95 to-black shadow-2xl">
        <div className="rounded-2xl overflow-hidden bg-white shadow-inner ring-1 ring-white/10">
          <iframe
            key={playlistId}
            frameBorder="no"
            width="100%"
            height="460"
            src={`https://music.163.com/outchain/player?type=0&id=${playlistId}&auto=0&height=430`}
            className="w-full block"
            title="网易云歌单官方播放器"
          />
        </div>
      </div>
    </div>
  );
};
