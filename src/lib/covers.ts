// Curated collection of high-aesthetic covers for technical & creative posts
const defaultCovers = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
];

export function extractFirstImage(body?: string | null): string | null {
  if (!body) return null;
  // Match Markdown ![alt](url) or HTML <img src="url">
  const mdRegex = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = mdRegex.exec(body)) !== null) {
    const url = match[1];
    if (url && !url.includes('mmbiz.qpic.cn') && !url.includes('friend_404')) {
      return url.replace(/^http:\/\//, 'https://');
    }
  }
  const htmlRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi;
  while ((match = htmlRegex.exec(body)) !== null) {
    const url = match[1];
    if (url && !url.includes('mmbiz.qpic.cn') && !url.includes('friend_404')) {
      return url.replace(/^http:\/\//, 'https://');
    }
  }
  return null;
}

export function getPostCover(
  cover?: string | null,
  title: string = '',
  index: number = 0,
  body?: string | null
): string {
  if (cover && cover.trim().length > 0 && !cover.includes('mmbiz.qpic.cn')) {
    return cover;
  }
  const firstInBody = extractFirstImage(body);
  if (firstInBody) {
    return firstInBody;
  }
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const selected = Math.abs(hash + index) % defaultCovers.length;
  return defaultCovers[selected];
}
