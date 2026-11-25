import React, { useState } from 'react';
import { Copy, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import galleryData from '@/data/gallery.json';

interface GalleryImg {
  alt: string;
  url: string;
}

interface GalleryAlbum {
  id: string;
  name: string;
  desc: string;
  images: GalleryImg[];
}

export const GalleryExplorer: React.FC = () => {
  const albums = galleryData as GalleryAlbum[];
  const [activeAlbumId, setActiveAlbumId] = useState<string>(albums[0]?.id || 'wallpaper');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [coverSetUrl, setCoverSetUrl] = useState<string | null>(null);

  const currentAlbum = albums.find((a) => a.id === activeAlbumId) || albums[0];

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleSetAsCover = (url: string) => {
    localStorage.setItem('blogbg', JSON.stringify({ type: 'image', value: url }));
    const cssVal = `url("${url}") center/cover no-repeat`;
    document.documentElement.style.setProperty('--hero-bg', cssVal);
    const globalBg = document.getElementById('global-blurred-bg');
    if (globalBg) globalBg.style.background = cssVal;
    setCoverSetUrl(url);
    setTimeout(() => setCoverSetUrl(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-terracotta mb-1.5">Curated Gallery</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-DEFAULT dark:text-cream-50">
            精选壁纸与图库
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-100 dark:text-cream-300 mt-2">
            保留原博客全部壁纸与主题画廊 · 支持一键复制图片链接或直接设为首页封面
          </p>
        </div>
      </div>

      {/* Album Tabs */}
      <div className="flex flex-wrap gap-2.5">
        {albums.map((album) => {
          const isActive = album.id === activeAlbumId;
          return (
            <button
              key={album.id}
              onClick={() => setActiveAlbumId(album.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                isActive
                  ? 'bg-terracotta text-white border-terracotta shadow-md'
                  : 'glass border-charcoal-500/15 dark:border-white/10 text-charcoal-200 dark:text-cream-300 hover:border-terracotta/40'
              }`}
            >
              {album.name} <span className="opacity-65">({album.images.length})</span>
            </button>
          );
        })}
      </div>

      {/* Masonry / Grid Images */}
      {currentAlbum && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentAlbum.images.map((img, idx) => (
            <div
              key={`${currentAlbum.id}-${idx}`}
              className="group relative rounded-2xl overflow-hidden border border-charcoal-500/10 dark:border-white/10 bg-zinc-900/20 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                <img
                  src={img.url}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/cover/img/background${(idx % 10) + 1}.webp`;
                  }}
                />
              </div>

              {/* Hover Action Overlay */}
              <div className="p-3 flex items-center justify-between gap-2 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md">
                <span className="text-xs font-mono truncate opacity-75 flex-1">{img.alt || `壁纸 #${idx + 1}`}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(img.url)}
                    className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-terracotta hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors"
                    title="复制图片链接"
                  >
                    {copiedUrl === img.url ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl === img.url ? '已复制' : '复制链接'}</span>
                  </button>
                  <button
                    onClick={() => handleSetAsCover(img.url)}
                    className="px-2.5 py-1 rounded-lg bg-terracotta/15 text-terracotta hover:bg-terracotta hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors"
                    title="直接设为首页封面"
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>{coverSetUrl === img.url ? '已设为封面!' : '设为封面'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
