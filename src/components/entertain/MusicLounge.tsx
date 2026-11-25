import React, { useState, useEffect } from 'react';
import { Disc, ExternalLink, Radio, ListMusic } from 'lucide-react';
import { NETEASE_PLAYLISTS } from '@/components/ui/NetEaseMusicPlayer';

export const MusicLounge: React.FC = () => {
  const [playlistId, setPlaylistId] = useState<string>('9333187603');

  useEffect(() => {
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

  const currentPlaylist = NETEASE_PLAYLISTS.find((p) => p.id === playlistId) || NETEASE_PLAYLISTS[0];

  return (
    <div className="space-y-6">
      {/* Mineradio-inspired Dark Studio Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-zinc-900 via-zinc-950 to-terracotta/25 text-white p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-full bg-zinc-950 border-4 border-white/15 flex items-center justify-center shadow-2xl shrink-0">
              <Disc className="w-10 h-10 text-terracotta animate-spin [animation-duration:8s]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/20 border border-terracotta/30 text-xs font-mono text-terracotta mb-2">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>NetEase Official · 歌单 {playlistId}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{currentPlaylist.name}</h1>
              <p className="text-white/65 text-xs sm:text-sm mt-1">
                {currentPlaylist.desc} · 与左下角音乐胶囊实时同步
              </p>
            </div>
          </div>

          <a
            href={`https://music.163.com/#/playlist?id=${playlistId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 text-xs font-semibold transition-all shadow-lg shrink-0"
          >
            <span>在网易云客户端打开</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Selectable Playlist Pills */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-white/50 flex items-center gap-1 mr-1">
            <ListMusic className="w-3.5 h-3.5" /> 切换歌单：
          </span>
          {NETEASE_PLAYLISTS.map((pl) => (
            <button
              key={pl.id}
              onClick={() => switchPlaylist(pl.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                pl.id === playlistId
                  ? 'bg-terracotta text-white border-terracotta shadow-md'
                  : 'bg-white/8 text-white/75 border-white/10 hover:bg-white/15 hover:text-white'
              }`}
            >
              {pl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Official NetEase Outer Player Container */}
      <div className="rounded-3xl overflow-hidden border border-charcoal-500/15 dark:border-white/10 shadow-2xl bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-charcoal-500/10 dark:border-white/10 bg-cream-100/80 dark:bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            <span className="ml-2 text-xs font-mono text-charcoal-100 dark:text-cream-400">
              网易云官方外链播放器 · 稳定播放
            </span>
          </div>
          <span className="text-[11px] font-mono text-terracotta">ID: {playlistId}</span>
        </div>

        <div className="p-2 sm:p-4 bg-white">
          <iframe
            key={playlistId}
            frameBorder="no"
            marginWidth={0}
            marginHeight={0}
            width="100%"
            height="460"
            src={`https://music.163.com/outchain/player?type=0&id=${playlistId}&auto=0&height=440`}
            className="w-full rounded-2xl"
            title="网易云歌单官方播放器"
          />
        </div>
      </div>
    </div>
  );
};
