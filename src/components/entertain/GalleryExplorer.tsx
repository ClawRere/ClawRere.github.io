import React, { useState } from 'react';
import { Copy, Check, Image as ImageIcon } from 'lucide-react';
import galleryData from '@/data/gallery.json';
import { DeviceLoader } from '@/components/ui/DeviceLoader';

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
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [loadedUrls, setLoadedUrls] = useState<Record<string, boolean>>({});

  const currentAlbum = albums.find((a) => a.id === activeAlbumId) || albums[0];
  const visibleImages = (currentAlbum?.images || []).filter((img) => !failedUrls[img.url]);

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
    <div className="space-y-6">
      {/* Album Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
                {album.name}
              </button>
            );
          })}
        </div>
        <span className="text-xs font-mono opacity-65">可用图片：{visibleImages.length} 张</span>
      </div>

      {/* Grid Images (hidden if image fails to load) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleImages.map((img, idx) => (
          <div
            key={`${currentAlbum.id}-${img.url}-${idx}`}
            className="group relative rounded-2xl overflow-hidden border border-charcoal-500/10 dark:border-white/10 bg-zinc-900/20 shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900/90 flex items-center justify-center">
              {!loadedUrls[img.url] && (
                <div className="absolute inset-0 flex items-center justify-center text-cream-200/70 pointer-events-none">
                  <DeviceLoader />
                </div>
              )}
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className={`relative z-10 w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                  loadedUrls[img.url] ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => {
                  setLoadedUrls((prev) => ({ ...prev, [img.url]: true }));
                }}
                onError={() => {
                  setFailedUrls((prev) => ({ ...prev, [img.url]: true }));
                }}
              />
            </div>

            <div className="p-3 flex items-center justify-between gap-2 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md">
              <span className="text-xs font-mono truncate opacity-75 flex-1">{img.alt || `壁纸 #${idx + 1}`}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopy(img.url)}
                  className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-terracotta hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors"
                >
                  {copiedUrl === img.url ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl === img.url ? '已复制' : '复制链接'}</span>
                </button>
                <button
                  onClick={() => handleSetAsCover(img.url)}
                  className="px-2.5 py-1 rounded-lg bg-terracotta/15 text-terracotta hover:bg-terracotta hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>{coverSetUrl === img.url ? '已设为封面!' : '设为封面'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
