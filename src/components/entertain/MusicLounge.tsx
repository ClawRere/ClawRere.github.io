import React, { useState, useEffect } from 'react';
import { Disc, ExternalLink, ListMusic, Radio, Sparkles, Search, Play, AlertCircle } from 'lucide-react';
import { NETEASE_PLAYLISTS } from '@/lib/musicStore';

const DEFAULT_API_BASE = 'https://neteaseapi.iyu6.com';

interface ApiTrack {
  id: number;
  name: string;
  artist: string;
  url?: string;
}

export const MusicLounge: React.FC = () => {
  const [playlistId, setPlaylistId] = useState(NETEASE_PLAYLISTS[0].id);
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [searchKw, setSearchKw] = useState('');
  const [apiTracks, setApiTracks] = useState<ApiTrack[]>([]);
  const [activeAudioUrl, setActiveAudioUrl] = useState('');
  const [activeTrackName, setActiveTrackName] = useState('');
  const [apiStatus, setApiStatus] = useState('');
  const [isLoadingApi, setIsLoadingApi] = useState(false);

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

  const handleSearchApi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKw.trim()) return;
    setIsLoadingApi(true);
    setApiStatus('');
    try {
      const base = apiBase.replace(/\/+$/, '');
      const res = await fetch(`${base}/search?keywords=${encodeURIComponent(searchKw.trim())}&limit=8`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const songs = json?.result?.songs || [];
      setApiTracks(
        songs.map((s: any) => ({
          id: s.id,
          name: s.name,
          artist: (s.artists || s.ar || []).map((a: any) => a.name).join(' / ') || '未知歌手',
        }))
      );
      if (!songs.length) setApiStatus('未搜索到相关曲目');
    } catch (err: any) {
      setApiStatus(`接口请求受限（${err?.message || '跨域/403'}），可继续使用下方官方外链播放器或更换自建 API 地址`);
    } finally {
      setIsLoadingApi(false);
    }
  };

  const handlePlayTrack = async (track: ApiTrack) => {
    setApiStatus('');
    try {
      const base = apiBase.replace(/\/+$/, '');
      const res = await fetch(`${base}/song/url?id=${track.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const url = json?.data?.[0]?.url;
      if (!url) throw new Error('暂无可用播放直链');
      setActiveAudioUrl(url);
      setActiveTrackName(`${track.name} - ${track.artist}`);
    } catch (err: any) {
      setApiStatus(`获取音源失败（${err?.message || '受限'}）`);
    }
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
              <p className="text-xs sm:text-sm text-white/60 mt-1">{currentPlaylist.desc} · 提示：官方外链音量可在播放器右下角或系统音量调节</p>
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

      {/* NetEase API (neteaseapi.iyu6.com) Search & Unblock Module */}
      <div className="rounded-3xl p-5 sm:p-6 glass border border-charcoal-500/12 dark:border-white/12 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-charcoal-DEFAULT dark:text-cream-50">🎧 网易云 API 搜索与解灰直链</h3>
            <p className="text-[11px] font-mono text-charcoal-100 dark:text-cream-400">
              默认接入 {DEFAULT_API_BASE}（支持自定义兼容 NeteaseCloudMusicApi 节点）
            </p>
          </div>
          <input
            type="url"
            value={apiBase}
            onChange={(e) => setApiBase(e.target.value)}
            placeholder="API 地址"
            className="px-3 py-1.5 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/60 dark:bg-black/30 text-xs font-mono w-64"
          />
        </div>

        <form onSubmit={handleSearchApi} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-100 dark:text-cream-400" />
            <input
              type="text"
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
              placeholder="输入歌名或歌手搜索（通过 NetEase API 解析）..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-charcoal-500/15 dark:border-white/10 bg-white/70 dark:bg-black/30 text-xs"
            />
          </div>
          <button
            type="submit"
            disabled={isLoadingApi}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-mono font-semibold transition-colors disabled:opacity-50"
          >
            {isLoadingApi ? '搜索中...' : 'API 搜索'}
          </button>
        </form>

        {apiStatus && (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{apiStatus}</span>
          </div>
        )}

        {activeAudioUrl && (
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-2">
            <div className="text-xs font-semibold text-rose-500">正在播放：{activeTrackName}</div>
            <audio src={activeAudioUrl} controls autoPlay className="w-full h-9" />
          </div>
        )}

        {apiTracks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {apiTracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handlePlayTrack(t)}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-charcoal-500/10 dark:border-white/10 hover:border-rose-500/40 bg-white/60 dark:bg-white/5 text-left transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{t.name}</div>
                  <div className="text-[11px] opacity-65 truncate">{t.artist}</div>
                </div>
                <Play className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              </button>
            ))}
          </div>
        )}
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
