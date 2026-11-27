import React, { useState, useEffect, useRef } from 'react';
import {
  Disc,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Radio,
  ListMusic,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { NETEASE_PLAYLISTS } from '@/lib/musicStore';

export interface CuratedSong {
  id: string;
  name: string;
  artist: string;
  tag: string;
  accent: string;
}

export const CURATED_SONGS: CuratedSong[] = [
  { id: '2600493765', name: '默认精选曲目', artist: '网易云电台', tag: '默认推荐', accent: '#f43f5e' },
  { id: '149297', name: 'I Still Want Your Love', artist: '专注轻音乐', tag: '轻音乐', accent: '#8b5cf6' },
  { id: '149294', name: 'River Flows in You', artist: 'Yiruma', tag: '钢琴', accent: '#3b82f6' },
  { id: '441552', name: 'Summer', artist: '久石让', tag: '经典', accent: '#10b981' },
  { id: '186016', name: '晴天', artist: '周杰伦', tag: '热歌榜', accent: '#f59e0b' },
  { id: '185811', name: '稻香', artist: '周杰伦', tag: '热歌榜', accent: '#84cc16' },
  { id: '1330348068', name: '起风了', artist: '买辣椒也用券', tag: '热歌榜', accent: '#ec4899' },
  { id: '185668', name: '夜曲', artist: '周杰伦', tag: '经典榜', accent: '#6366f1' },
];

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const MusicLounge: React.FC = () => {
  const [playlistId, setPlaylistId] = useState(NETEASE_PLAYLISTS[0].id);
  const [activeSong, setActiveSong] = useState<CuratedSong>(CURATED_SONGS[0]);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('就绪 · 点击曲目自动播放');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [showOfficialOutchain, setShowOfficialOutchain] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldAutoPlayRef = useRef(false);

  const resolveSongUrl = async (song: CuratedSong, autoPlay = true) => {
    setActiveSong(song);
    setIsLoading(true);
    shouldAutoPlayRef.current = autoPlay;
    setStatusMsg('正在匹配可用音源...');
    try {
      const res = await fetch(`https://neteaseapi.iyu6.com/match?id=${song.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const matchedUrl =
        json?.url || json?.data?.url || (Array.isArray(json?.data) ? json.data[0]?.url : '');
      if (matchedUrl && typeof matchedUrl === 'string') {
        setAudioUrl(matchedUrl);
        setStatusMsg(autoPlay ? `正在播放：${song.name}` : `已就绪：${song.name}`);
        window.dispatchEvent(new CustomEvent('site-music-song-change', { detail: { name: song.name, artist: song.artist } }));
        return;
      }
      throw new Error('no url');
    } catch {
      setAudioUrl(`https://music.163.com/song/media/outer/url?id=${song.id}.mp3`);
      setStatusMsg(autoPlay ? `正在播放：${song.name}` : `已就绪：${song.name}`);
      window.dispatchEvent(new CustomEvent('site-music-song-change', { detail: { name: song.name, artist: song.artist } }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    resolveSongUrl(CURATED_SONGS[0], false);
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    audio.volume = isMuted ? 0 : volume;
    if (shouldAutoPlayRef.current) {
      audio.load();
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const playOffset = (delta: number) => {
    const idx = CURATED_SONGS.findIndex((s) => s.id === activeSong.id);
    const nextIdx = (idx + delta + CURATED_SONGS.length) % CURATED_SONGS.length;
    resolveSongUrl(CURATED_SONGS[nextIdx], true);
  };

  const handleSelectPlaylist = (id: string) => {
    setPlaylistId(id);
    localStorage.setItem('larry_netease_playlist_id', id);
    window.dispatchEvent(new CustomEvent('larry-playlist-change', { detail: id }));
  };

  const currentPlaylist = NETEASE_PLAYLISTS.find((p) => p.id === playlistId) || NETEASE_PLAYLISTS[0];
  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="space-y-6">
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime || 0);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration || 0);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => playOffset(1)}
      />

      {/* MineRadio-Inspired Vinyl Studio Console */}
      <div className="relative rounded-[2rem] border border-white/12 bg-gradient-to-br from-zinc-900 via-[#14151b] to-black text-white overflow-hidden shadow-2xl">
        {/* Ambient Glow */}
        <div
          className="absolute -top-28 -left-24 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-700"
          style={{ background: activeSong.accent }}
        />
        <div className="absolute -bottom-28 -right-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar with Mode Toggle */}
        <div className="relative z-10 px-6 sm:px-8 pt-5 pb-3 flex items-center justify-between border-b border-white/8">
          <div className="flex items-center gap-2 text-xs font-mono text-white/70">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>MINERADIO · 黑胶音乐电台</span>
          </div>
          <button
            type="button"
            onClick={() => setShowOfficialOutchain((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 hover:bg-white/15 border border-white/12 text-[11px] font-mono text-white/80 transition-all"
            title="切换黑胶电台 / 网易云官方外链"
          >
            {showOfficialOutchain ? (
              <>
                <ToggleRight className="w-3.5 h-3.5 text-rose-400" />
                <span>官方外链模式</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-3.5 h-3.5 text-white/60" />
                <span>切换官方外链</span>
              </>
            )}
          </button>
        </div>

        {!showOfficialOutchain ? (
          <div className="relative z-10 p-6 sm:p-8 space-y-7">
            {/* Turntable + Controls */}
            <div className="flex flex-col md:flex-row items-center gap-7 md:gap-10">
              {/* Vinyl Turntable */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
                {/* Tonearm */}
                <div
                  className={`absolute -top-2 right-2 w-1.5 h-20 rounded-full bg-gradient-to-b from-zinc-300 to-zinc-500 origin-top z-20 transition-transform duration-500 shadow-md ${
                    isPlaying ? 'rotate-[24deg]' : 'rotate-[4deg]'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-200 -ml-1 -mt-1 border border-zinc-600" />
                  <div className="w-2.5 h-4 rounded-sm bg-rose-400 -ml-0.5 mt-16" />
                </div>

                {/* Spinning Vinyl Disc */}
                <div
                  onClick={togglePlay}
                  className={`w-40 h-40 sm:w-44 sm:h-44 rounded-full cursor-pointer shadow-[0_16px_40px_rgba(0,0,0,0.65)] border-4 border-zinc-800 flex items-center justify-center relative ${
                    isPlaying ? 'animate-spin [animation-duration:7s]' : ''
                  }`}
                  style={{
                    background:
                      'repeating-radial-gradient(circle at center, #18181b 0px, #18181b 3px, #27272a 4px, #18181b 5px)',
                  }}
                  title={isPlaying ? '点击暂停' : '点击播放'}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner border-2 border-white/20"
                    style={{ background: activeSong.accent }}
                  >
                    <div className="w-4 h-4 rounded-full bg-zinc-950 border border-white/40" />
                  </div>
                </div>
              </div>

              {/* Track Info & Scrubber */}
              <div className="flex-1 w-full min-w-0 space-y-4 text-center md:text-left">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-mono text-white/80 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                    <span>{activeSong.tag}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-rose-300">{isLoading ? '正在加载音源...' : statusMsg}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
                    {activeSong.name}
                  </h2>
                  <p className="text-sm text-white/60 mt-1">{activeSong.artist}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div
                    onClick={(e) => {
                      const audio = audioRef.current;
                      if (!audio || !duration) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      audio.currentTime = ratio * duration;
                      setCurrentTime(audio.currentTime);
                    }}
                    className="h-2 rounded-full bg-white/12 cursor-pointer overflow-hidden group"
                  >
                    <div
                      className="h-full rounded-full transition-all duration-150"
                      style={{
                        width: `${progressPct}%`,
                        background: `linear-gradient(90deg, ${activeSong.accent}, #fb7185)`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-white/45">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Playback Controls + Volume */}
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => playOffset(-1)}
                      className="p-2.5 rounded-full bg-white/8 hover:bg-white/15 text-white/85 transition-all active:scale-95"
                      title="上一首"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                      style={{ background: activeSong.accent }}
                      title={isPlaying ? '暂停' : '播放'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => playOffset(1)}
                      className="p-2.5 rounded-full bg-white/8 hover:bg-white/15 text-white/85 transition-all active:scale-95"
                      title="下一首"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsMuted((m) => !m)}
                      className="text-white/75 hover:text-white transition-colors"
                      title={isMuted ? '取消静音' : '静音'}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.02}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setIsMuted(false);
                        setVolume(Number(e.target.value));
                      }}
                      className="w-20 accent-rose-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Song Track List (Click to Auto-Play) */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-xs font-mono text-white/50 mb-3 flex items-center gap-1.5">
                <ListMusic className="w-3.5 h-3.5" />
                <span>精选电台曲库 · 点击即刻播放</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {CURATED_SONGS.map((song, idx) => {
                  const isActive = activeSong.id === song.id;
                  return (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => resolveSongUrl(song, true)}
                      className={`group flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-2xl border text-left transition-all ${
                        isActive
                          ? 'border-rose-400/60 bg-white/12 shadow-md'
                          : 'border-white/8 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-full text-[10px] font-mono flex items-center justify-center shrink-0 ${
                            isActive ? 'text-white font-bold' : 'bg-white/10 text-white/50'
                          }`}
                          style={isActive ? { background: song.accent } : undefined}
                        >
                          {isActive && isPlaying ? '♪' : idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate text-white">{song.name}</div>
                          <div className="text-[10px] text-white/50 truncate">{song.artist} · {song.tag}</div>
                        </div>
                      </div>
                      <Play className={`w-3.5 h-3.5 shrink-0 transition-opacity ${isActive ? 'text-rose-400 fill-current' : 'opacity-40 group-hover:opacity-90'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Optional Official NetEase Outchain View */
          <div className="relative z-10 p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{currentPlaylist.name}</h2>
                <p className="text-xs text-white/55 mt-0.5">{currentPlaylist.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {NETEASE_PLAYLISTS.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleSelectPlaylist(pl.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      pl.id === playlistId
                        ? 'bg-rose-500 text-white shadow'
                        : 'bg-white/10 text-white/70 hover:bg-white/15'
                    }`}
                  >
                    {pl.name}
                  </button>
                ))}
              </div>
            </div>
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
        )}
      </div>
    </div>
  );
};
