import React, { useState, useEffect, useRef } from 'react';
import { Disc, ChevronUp, ExternalLink, Play, Pause, SkipForward, Radio, ToggleLeft, ToggleRight } from 'lucide-react';
import { NETEASE_PLAYLISTS } from '@/lib/musicStore';

export { NETEASE_PLAYLISTS };

const CAPSULE_SONGS = [
  { id: '2600493765', name: '默认精选曲目', artist: '网易云电台' },
  { id: '149297', name: 'I Still Want Your Love', artist: '轻音乐' },
  { id: '149294', name: 'River Flows in You', artist: 'Yiruma' },
  { id: '441552', name: 'Summer', artist: '久石让' },
  { id: '186016', name: '晴天', artist: '周杰伦' },
  { id: '1330348068', name: '起风了', artist: '买辣椒也用券' },
];

export const NetEaseMusicPlayer: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOfficial, setShowOfficial] = useState(false);
  const [playlistId, setPlaylistId] = useState(NETEASE_PLAYLISTS[0].id);
  const [activeSong, setActiveSong] = useState(CAPSULE_SONGS[0]);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldPlayRef = useRef(false);

  const resolveCapsuleSong = async (song: (typeof CAPSULE_SONGS)[number], autoPlay: boolean) => {
    setActiveSong(song);
    shouldPlayRef.current = autoPlay;
    try {
      const res = await fetch(`https://neteaseapi.iyu6.com/match?id=${song.id}`);
      if (!res.ok) throw new Error('err');
      const json = await res.json();
      const url = json?.url || json?.data?.url || (Array.isArray(json?.data) ? json.data[0]?.url : '');
      if (url && typeof url === 'string') {
        setAudioUrl(url);
        return;
      }
      throw new Error('empty');
    } catch {
      setAudioUrl(`https://music.163.com/song/media/outer/url?id=${song.id}.mp3`);
    }
  };

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    if (shouldPlayRef.current) {
      audio.load();
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [audioUrl]);

  if (!isEnabled) return null;

  const currentPlaylist = NETEASE_PLAYLISTS.find((p) => p.id === playlistId) || NETEASE_PLAYLISTS[0];

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioUrl) {
      resolveCapsuleSong(activeSong, true);
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const idx = CAPSULE_SONGS.findIndex((s) => s.id === activeSong.id);
    const next = CAPSULE_SONGS[(idx + 1) % CAPSULE_SONGS.length];
    resolveCapsuleSong(next, true);
  };

  const handleSelectPlaylist = (id: string) => {
    setPlaylistId(id);
    localStorage.setItem('larry_netease_playlist_id', id);
    window.dispatchEvent(new CustomEvent('larry-playlist-change', { detail: id }));
  };

  return (
    <div className="fixed bottom-5 left-4 z-40 flex flex-col items-start gap-2.5">
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => handleNext()}
      />

      {/* Expandable MineRadio Mini Studio Drawer */}
      <div
        className={`w-[310px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-gradient-to-br from-zinc-900/95 via-[#14151b]/95 to-black/95 backdrop-blur-2xl text-white transition-all duration-300 origin-bottom-left ${
          isExpanded
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none h-0 border-0 shadow-none'
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
            <span className="text-xs font-bold truncate">MineRadio · 黑胶电台</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowOfficial((v) => !v)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/8 hover:bg-white/15 text-[10px] font-mono text-white/75 transition-colors"
              title="切换官方外链"
            >
              {showOfficial ? <ToggleRight className="w-3 h-3 text-rose-400" /> : <ToggleLeft className="w-3 h-3" />}
              <span>{showOfficial ? '外链' : '电台'}</span>
            </button>
            <a
              href="/entertain/music"
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-rose-300 transition-colors"
              title="前往音乐馆"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {!showOfficial ? (
          <div className="p-3 space-y-2.5">
            {/* Active Song Card */}
            <div className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-white/[0.06] border border-white/8">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center shrink-0 ${
                    isPlaying ? 'animate-spin [animation-duration:5s]' : ''
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-rose-500 border border-white/40" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{activeSong.name}</div>
                  <div className="text-[10px] text-white/55 truncate">{activeSong.artist}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center transition-colors"
                  title={isPlaying ? '暂停' : '播放'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  title="下一首"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Track Switcher */}
            <div className="max-h-36 overflow-y-auto space-y-1 pr-0.5">
              {CAPSULE_SONGS.map((s) => {
                const active = s.id === activeSong.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => resolveCapsuleSong(s, true)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                      active ? 'bg-rose-500/20 text-rose-200 font-medium' : 'hover:bg-white/8 text-white/75'
                    }`}
                  >
                    <span className="truncate">{s.name}</span>
                    <span className="text-[10px] opacity-60 shrink-0 ml-2">{s.artist}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
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
            <div className="p-2 bg-zinc-900/80">
              <div className="rounded-xl overflow-hidden bg-white shadow-inner">
                <iframe
                  key={playlistId}
                  frameBorder="no"
                  width="100%"
                  height="200"
                  src={`https://music.163.com/outchain/player?type=0&id=${playlistId}&auto=0&height=180`}
                  title="网易云音乐官方外链播放器"
                  className="block w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sleek MineRadio Capsule Trigger */}
      <div
        style={{ transform: 'scale(var(--pill-scale, 1))', transformOrigin: 'bottom left' }}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-gradient-to-r from-zinc-900/95 to-zinc-950/95 border border-white/15 shadow-2xl backdrop-blur-xl text-white transition-all"
      >
        <button
          type="button"
          onClick={handleTogglePlay}
          className="w-7 h-7 rounded-full bg-rose-500/20 hover:bg-rose-500/35 border border-rose-400/35 flex items-center justify-center transition-colors shrink-0"
          title={isPlaying ? '暂停' : '播放'}
        >
          <Disc className={`w-4 h-4 text-rose-400 ${isPlaying ? 'animate-spin [animation-duration:4s]' : ''}`} />
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 min-w-0 text-left"
          title="展开/收起黑胶电台"
        >
          <span className="text-xs font-medium tracking-wide max-w-[110px] truncate">
            {showOfficial ? currentPlaylist.name : activeSong.name}
          </span>
          <span className="flex items-end gap-[2px] h-3 shrink-0" aria-hidden="true">
            <span className={`w-[2px] rounded-full bg-rose-400 ${isPlaying ? 'h-3 animate-pulse' : 'h-1 opacity-50'}`} />
            <span className={`w-[2px] rounded-full bg-rose-400 ${isPlaying ? 'h-2 animate-pulse [animation-delay:150ms]' : 'h-1.5 opacity-50'}`} />
            <span className={`w-[2px] rounded-full bg-rose-400 ${isPlaying ? 'h-3 animate-pulse [animation-delay:300ms]' : 'h-1 opacity-50'}`} />
          </span>
          <ChevronUp className={`w-3.5 h-3.5 text-white/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
