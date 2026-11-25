import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc, ExternalLink, Radio } from 'lucide-react';
import { musicStore, PLAYLIST_ID, type Track } from '@/lib/musicStore';

export const MusicLounge: React.FC = () => {
  const [state, setState] = useState(musicStore.state);
  const [showOfficialEmbed, setShowOfficialEmbed] = useState(false);

  useEffect(() => {
    return musicStore.subscribe((next) => setState(next));
  }, []);

  const currentTrack: Track | undefined = state.tracks[state.currentIndex];
  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Mineradio-inspired Dark Frosted Studio Console */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-zinc-900 via-zinc-950 to-terracotta/25 text-white p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Spinning Vinyl Record */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 shrink-0 flex items-center justify-center">
            <div className={`w-full h-full rounded-full bg-zinc-950 border-4 border-white/15 shadow-2xl flex items-center justify-center overflow-hidden ${state.isPlaying ? 'animate-spin [animation-duration:14s]' : ''}`}>
              <img
                src={currentTrack?.pic}
                alt={currentTrack?.title}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-zinc-800"
              />
            </div>
            <div className="absolute w-5 h-5 rounded-full bg-zinc-900 border-2 border-white/25" />
          </div>

          {/* Track Info & Synced Controls */}
          <div className="flex-1 w-full text-center md:text-left space-y-5">
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/20 text-terracotta text-xs font-mono border border-terracotta/30">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Mineradio 同步电台 · 歌单 {PLAYLIST_ID}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOfficialEmbed(!showOfficialEmbed)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono transition-colors"
                >
                  {showOfficialEmbed ? '切换 Mineradio 同步台' : '网易云官方外链'}
                </button>
                <a
                  href={`https://music.163.com/#/playlist?id=${PLAYLIST_ID}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono transition-colors"
                >
                  网易云打开 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{currentTrack?.title || '加载歌单中...'}</h1>
              <p className="text-white/60 text-sm mt-1">{currentTrack?.author || '网易云精选歌单'}</p>
              {state.errorMsg && (
                <p className="text-amber-300 text-xs font-mono mt-2">{state.errorMsg}</p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <input
                type="range"
                min={0}
                max={state.duration || 100}
                value={state.currentTime}
                onChange={(e) => musicStore.seek(Number(e.target.value))}
                className="w-full h-1.5 rounded-full accent-terracotta cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-white/45">
                <span>{formatTime(state.currentTime)}</span>
                <span>{formatTime(state.duration)}</span>
              </div>
            </div>

            {/* Playback & Volume Controls */}
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => musicStore.prev()} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={() => musicStore.togglePlay()}
                  className="p-4 rounded-full bg-terracotta hover:bg-terracotta/90 text-white shadow-xl transition-transform active:scale-95"
                >
                  {state.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <button onClick={() => musicStore.next()} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2.5 w-44">
                <button onClick={() => musicStore.toggleMute()} className="text-white/70 hover:text-white">
                  {state.isMuted || state.volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={state.isMuted ? 0 : state.volume}
                  onChange={(e) => musicStore.setVolume(Number(e.target.value))}
                  className="flex-1 h-1 rounded-full accent-terracotta cursor-pointer"
                />
                <span className="text-xs font-mono text-white/50 w-7 text-right">{state.isMuted ? 0 : state.volume}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synced Tracklist OR Official NetEase Embed */}
      {showOfficialEmbed ? (
        <div className="rounded-3xl overflow-hidden border border-charcoal-500/10 dark:border-white/10 p-3 bg-white shadow-xl">
          <iframe
            frameBorder="no"
            width="100%"
            height="450"
            src={`https://music.163.com/outchain/player?type=0&id=${PLAYLIST_ID}&auto=0&height=430`}
            className="w-full rounded-2xl"
            title="网易云歌单官方播放器"
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-charcoal-500/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-charcoal-500/10 dark:border-white/10 flex items-center justify-between">
            <span className="font-semibold text-sm text-charcoal-DEFAULT dark:text-cream-50 flex items-center gap-2">
              <Disc className="w-4 h-4 text-terracotta" />
              播放列表 ({state.tracks.length} 首) — 与左下角胶囊实时同步
            </span>
          </div>
          <div className="divide-y divide-charcoal-500/8 dark:divide-white/8 max-h-[420px] overflow-y-auto">
            {state.tracks.map((track, idx) => (
              <button
                key={`${track.title}-${idx}`}
                onClick={() => musicStore.playTrack(idx)}
                className={`w-full px-6 py-3.5 flex items-center justify-between text-left hover:bg-terracotta/5 transition-colors ${
                  idx === state.currentIndex ? 'bg-terracotta/10 text-terracotta font-semibold' : 'text-charcoal-DEFAULT dark:text-cream-100'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs font-mono opacity-50 w-6">{String(idx + 1).padStart(2, '0')}</span>
                  <img src={track.pic} alt={track.title} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm truncate">{track.title}</div>
                    <div className="text-xs opacity-60 truncate">{track.author}</div>
                  </div>
                </div>
                {idx === state.currentIndex && state.isPlaying && (
                  <span className="text-xs font-mono text-terracotta">正在播放 ♪</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
