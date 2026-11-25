import React from 'react';
import { Disc, ExternalLink, Radio, Sparkles } from 'lucide-react';

const PLAYLIST_ID = '9333187603';

export const MusicLounge: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Sleek Glassmorphic Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-rose-950/60 text-white p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-terracotta to-rose-500 flex items-center justify-center shadow-2xl shrink-0">
              <Disc className="w-10 h-10 text-white animate-spin [animation-duration:8s]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-amber-300 mb-2">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>NetEase Cloud Music · 歌单 {PLAYLIST_ID}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">磊大大的私人音乐馆</h1>
              <p className="text-white/65 text-xs sm:text-sm mt-1">
                免费无损精选歌单 · 编码、设计、思考时的最佳背景声景
              </p>
            </div>
          </div>

          <a
            href={`https://music.163.com/#/playlist?id=${PLAYLIST_ID}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 text-xs font-semibold transition-all shadow-lg shrink-0"
          >
            <span>在网易云客户端打开</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* macOS-style Official NetEase Playlist Container */}
      <div className="rounded-3xl overflow-hidden border border-charcoal-500/15 dark:border-white/10 shadow-2xl bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-charcoal-500/10 dark:border-white/10 bg-cream-100/80 dark:bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            <span className="ml-2 text-xs font-mono text-charcoal-100 dark:text-cream-400">
              官方稳定外链播放 · 支持顺序/随机/单曲循环
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-terracotta">
            <Sparkles className="w-3 h-3" /> 100% 可播放
          </span>
        </div>

        <div className="p-2 sm:p-4 bg-white">
          <iframe
            frameBorder="no"
            marginWidth={0}
            marginHeight={0}
            width="100%"
            height="460"
            src={`https://music.163.com/outchain/player?type=0&id=${PLAYLIST_ID}&auto=0&height=440`}
            className="w-full rounded-2xl"
            title="网易云歌单官方播放器"
          />
        </div>
      </div>
    </div>
  );
};
