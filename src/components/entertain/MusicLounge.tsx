import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc, ExternalLink, ListMusic, Radio } from 'lucide-react';
import { musicStore, NETEASE_PLAYLISTS, type Track } from '@/lib/musicStore';

export const MusicLounge: React.FC = () => {
  const [state, setState] = useState(musicStore.state);
  const [showOfficialEmbed, setShowOfficialEmbed] = useState(false);

  useEffect(() => {
    return musicStore.subscribe((next) => setState(next));
  }, []);

  const currentTrack: Track | undefined = state.tracks[state.currentIndex];
  const currentPlaylist = NETEASE_PLAYLISTS.find((p) => p.id === state.playlistId) || NETEASE_PLAYLISTS[0];
  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* raga. Inspired Dark Frosted Studio Console */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-2xl text-white overflow-hidden shadow-2xl">
        {/* Top raga progress bar */}
        <div className="w-full h-[3px] bg-white/10">
          <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-zinc-900 border border-white/15 shadow-2xl shrink-0">
            <img
              src={currentTrack?.pic}
              alt={currentTrack?.title}
              className={`w-full h-full object-cover ${state.isPlaying ? 'scale-105 transition-transform duration-700' : ''}`}
            />
          </div>

          <div className="flex-1 w-full text-center md:text-left space-y-4">
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-mono border border-blue-500/25">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>raga. 同步电台 · {currentPlaylist.name}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOfficialEmbed(!showOfficialEmbed)}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono transition-colors"
                >
                  {showOfficialEmbed ? '返回同步列表' : '网易云官方外链'}
                </button>
                <a
                  href={`https://music.163.com/#/playlist?id=${state.playlistId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white text-black hover:bg-white/90 text-xs font-semibold transition-colors"
                >
                  网易云打开 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {currentTrack?.title || 'I Still Want Your Love'}
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {currentTrack?.author || currentPlaylist.desc} · 切页不断流，与左下角胶囊完全同步
              </p>
              {state.errorMsg && <p className="text-amber-300 text-xs font-mono mt-1.5">{state.errorMsg}</p>}
            </div>

            {/* Scrubber */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={state.duration || 100}
                value={state.currentTime}
                onChange={(e) => musicStore.seek(Number(e.target.value))}
                className="w-full h-1 rounded-full accent-white cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-white/45">
                <span>{formatTime(state.currentTime)}</span>
                <span>{formatTime(state.duration)}</span>
              </div>
            </div>

            {/* Playback & Volume Controls (Default 20%) */}
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => musicStore.prev()} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => musicStore.togglePlay()}
                  className="p-3.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white shadow-xl transition-transform active:scale-95"
                >
                  {state.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button onClick={() => musicStore.next()} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2.5 w-48">
                <button onClick={() => musicStore.toggleMute()} className="text-white/70 hover:text-white">
                  {state.isMuted || state.volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={state.isMuted ? 0 : state.volume}
                  onChange={(e) => musicStore.setVolume(Number(e.target.value))}
                  className="flex-1 h-1 rounded-full accent-blue-400 cursor-pointer"
                />
                <span className="text-xs font-mono text-white/60 w-9 text-right">
                  {state.isMuted ? 0 : state.volume}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Selector Bar */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/10 flex flex-wrap items-center gap-2 bg-black/20">
          <span className="text-xs font-mono text-white/50 flex items-center gap-1 mr-1">
            <ListMusic className="w-3.5 h-3.5" /> 切换歌单：
          </span>
          {NETEASE_PLAYLISTS.map((pl) => (
            <button
              key={pl.id}
              onClick={() => musicStore.switchPlaylist(pl.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pl.id === state.playlistId
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-white/5 text-white/65 hover:bg-white/10 hover:text-white'
              }`}
            >
              {pl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Synced Tracklist OR Official NetEase Embed */}
      {showOfficialEmbed ? (
        <div className="rounded-2xl overflow-hidden border border-charcoal-500/15 dark:border-white/10 p-3 bg-white shadow-xl">
          <iframe
            key={state.playlistId}
            frameBorder="no"
            width="100%"
            height="450"
            src={`https://music.163.com/outchain/player?type=0&id=${state.playlistId}&auto=0&height=430`}
            className="w-full rounded-xl"
            title="网易云歌单官方播放器"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-charcoal-500/10 dark:border-white/10 bg-zinc-950/80 text-white backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="px-6 py-3.5 border-b border-white/10 flex items-center justify-between">
            <span className="font-semibold text-sm flex items-center gap-2">
              <Disc className="w-4 h-4 text-blue-400" />
              播放队列 ({state.tracks.length} 首) — 与左下角胶囊实时同步
            </span>
          </div>
          <div className="divide-y divide-white/5 max-h-[420px] overflow-y-auto">
            {state.tracks.map((track, idx) => (
              <button
                key={`${track.title}-${idx}`}
                onClick={() => musicStore.playTrack(idx)}
                className={`w-full px-6 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors ${
                  idx === state.currentIndex ? 'bg-blue-500/15 text-blue-400 font-semibold' : 'text-white/85'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs font-mono opacity-45 w-6">{String(idx + 1).padStart(2, '0')}</span>
                  <img src={track.pic} alt={track.title} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm truncate">{track.title}</div>
                    <div className="text-xs opacity-55 truncate">{track.author}</div>
                  </div>
                </div>
                {idx === state.currentIndex && state.isPlaying && (
                  <span className="text-xs font-mono text-blue-400">正在播放 ♪</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
