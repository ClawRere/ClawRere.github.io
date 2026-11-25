import React, { useState, useEffect } from 'react';
import { Disc, ExternalLink, ListMusic, Radio, Volume2 } from 'lucide-react';
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
      {/* raga-inspired Clean Minimal Streaming Layout */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-2xl text-white overflow-hidden shadow-2xl">
        {/* Top 2px raga-style white progress bar accent */}
        <div className="w-full h-[3px] bg-white/10">
          <div className="w-1/3 h-full bg-white rounded-r-full" />
        </div>

        <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          {/* Left: Clean Cover + Typography (raga Circular aesthetic) */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-blue-500/30 via-zinc-900 to-zinc-950 border border-white/15 flex items-center justify-center shadow-xl shrink-0">
              <Disc className="w-10 h-10 text-white animate-spin [animation-duration:10s]" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span>raga. style · NetEase {playlistId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{currentPlaylist.name}</h1>
              <p className="text-white/55 text-xs sm:text-sm mt-1">
                {currentPlaylist.desc} · 默认音量 40% · 折叠左下角胶囊不断流
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/70">
              <Volume2 className="w-3.5 h-3.5 text-blue-400" /> 40%
            </span>
            <a
              href={`https://music.163.com/#/playlist?id=${playlistId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 text-xs font-bold transition-all"
            >
              <span>网易云打开</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Playlist Switcher Pills */}
        <div className="px-6 sm:px-8 pb-5 flex flex-wrap items-center gap-2 border-b border-white/10">
          <span className="text-xs font-mono text-white/45 flex items-center gap-1 mr-1">
            <ListMusic className="w-3.5 h-3.5" /> 切换歌单：
          </span>
          {NETEASE_PLAYLISTS.map((pl) => (
            <button
              key={pl.id}
              onClick={() => switchPlaylist(pl.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pl.id === playlistId
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-white/5 text-white/65 hover:bg-white/10 hover:text-white'
              }`}
            >
              {pl.name}
            </button>
          ))}
        </div>

        {/* Official NetEase Outer Player */}
        <div className="p-3 sm:p-5 bg-white">
          <iframe
            key={playlistId}
            frameBorder="no"
            marginWidth={0}
            marginHeight={0}
            width="100%"
            height="460"
            src={`https://music.163.com/outchain/player?type=0&id=${playlistId}&auto=0&height=440`}
            className="w-full rounded-xl"
            title="网易云歌单官方播放器"
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
};
