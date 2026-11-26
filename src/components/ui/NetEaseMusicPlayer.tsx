import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronUp, ExternalLink, Disc } from 'lucide-react';
import { musicStore, NETEASE_PLAYLISTS, type Track } from '@/lib/musicStore';

export { NETEASE_PLAYLISTS };

export const NetEaseMusicPlayer: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [state, setState] = useState(musicStore.state);

  useEffect(() => {
    if (localStorage.getItem('show_music') === 'false') setIsEnabled(false);
    return musicStore.subscribe((next) => setState(next));
  }, []);

  if (!isEnabled) return null;

  const currentTrack: Track | undefined = state.tracks[state.currentIndex];
  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className="fixed bottom-5 left-4 z-40 flex flex-col items-start gap-2.5">
      {/* Expanded raga-style Card (kept mounted or synced to global audio so collapse/navigation NEVER stops music!) */}
      <div
        className={`w-80 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-950/95 backdrop-blur-2xl text-white transition-all duration-300 origin-bottom-left ${
          isExpanded
            ? 'opacity-100 scale-100 pointer-events-auto h-auto'
            : 'opacity-0 scale-95 pointer-events-none h-0 border-0 shadow-none overflow-hidden'
        }`}
      >
        {/* Top thin white progress bar */}
        <div className="w-full h-[2px] bg-white/10">
          <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
        </div>

        {/* Header */}
        <div className="p-3.5 flex items-center gap-3 border-b border-white/10">
          <img
            src={currentTrack?.pic}
            alt={currentTrack?.title}
            className={`w-11 h-11 rounded-xl object-cover shrink-0 border border-white/15 ${
              state.isPlaying ? 'animate-spin [animation-duration:12s]' : ''
            }`}
          />
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm truncate">{currentTrack?.title || 'I Still Want Your Love'}</div>
            <div className="text-xs text-white/60 truncate">{currentTrack?.author || '专注轻音乐'}</div>
          </div>
          <a
            href="/entertain/music"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-400 transition-colors"
            title="打开 raga 音乐馆"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {state.errorMsg && (
          <div className="px-3.5 py-1.5 bg-amber-500/15 text-amber-300 text-[10px] font-mono">
            {state.errorMsg}
          </div>
        )}

        {/* Playlist Switcher */}
        <div className="flex gap-1.5 overflow-x-auto px-3 py-2 border-b border-white/10 scrollbar-none">
          {NETEASE_PLAYLISTS.map((pl) => (
            <button
              key={pl.id}
              onClick={() => musicStore.switchPlaylist(pl.id)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all ${
                pl.id === state.playlistId
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {pl.name}
            </button>
          ))}
        </div>

        {/* Playback & Volume Controls (Default 20%) */}
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button onClick={() => musicStore.prev()} className="p-1.5 rounded-lg hover:bg-white/10 text-white/80">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => musicStore.togglePlay()}
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 text-white shadow-lg transition-transform active:scale-95"
            >
              {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button onClick={() => musicStore.next()} className="p-1.5 rounded-lg hover:bg-white/10 text-white/80">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-[130px]">
            <button onClick={() => musicStore.toggleMute()} className="text-white/60 hover:text-white">
              {state.isMuted || state.volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={state.isMuted ? 0 : state.volume}
              onChange={(e) => musicStore.setVolume(Number(e.target.value))}
              className="w-full h-1 rounded-full accent-blue-400 cursor-pointer"
              title={`音量: ${state.volume}%`}
            />
            <span className="text-[10px] font-mono text-white/50 w-6 text-right">{state.isMuted ? 0 : state.volume}%</span>
          </div>
        </div>

        {/* Tracklist */}
        <div className="max-h-40 overflow-y-auto border-t border-white/10 divide-y divide-white/5">
          {state.tracks.slice(0, 20).map((t, idx) => (
            <button
              key={`${t.title}-${idx}`}
              onClick={() => musicStore.playTrack(idx)}
              className={`w-full px-4 py-2 text-left flex items-center justify-between text-xs hover:bg-white/8 transition-colors ${
                idx === state.currentIndex ? 'text-blue-400 bg-blue-500/10 font-semibold' : 'text-white/75'
              }`}
            >
              <span className="truncate flex-1 pr-2">{idx + 1}. {t.title}</span>
              <span className="text-[10px] text-white/45 truncate max-w-[70px]">{t.author}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Default Capsule Pill: Prev / Play-Pause / Next / Volume / Track */}
      <div
        style={{ transform: 'scale(var(--pill-scale, 1))', transformOrigin: 'bottom left' }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950/90 border border-white/15 shadow-2xl backdrop-blur-xl text-white"
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-6 h-6 flex items-center justify-center shrink-0"
          title="展开/收起音乐卡片"
        >
          <Disc className={`w-5 h-5 text-blue-400 ${state.isPlaying ? 'animate-spin [animation-duration:4s]' : ''}`} />
        </button>

        <button onClick={() => musicStore.prev()} className="p-1 rounded-full hover:bg-white/10 text-white/75 hover:text-white transition-colors" title="上一曲">
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => musicStore.togglePlay()}
          className="p-1.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white transition-transform active:scale-95"
          title={state.isPlaying ? '暂停' : '播放'}
        >
          {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <button onClick={() => musicStore.next()} className="p-1 rounded-full hover:bg-white/10 text-white/75 hover:text-white transition-colors" title="下一曲">
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button onClick={() => musicStore.toggleMute()} className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors" title={`音量 ${state.volume}%`}>
          {state.isMuted || state.volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden sm:flex items-center gap-1.5 pl-1 pr-1.5 text-xs text-white/85 hover:text-white max-w-[140px] truncate"
          title="展开/收起歌单与音量设置"
        >
          <span className="truncate">{currentTrack?.title || 'I Still Want Your Love'}</span>
          <ChevronUp className={`w-3.5 h-3.5 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
