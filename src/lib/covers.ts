// Curated collection of crisp local cartoon/scenic SVG covers for technical & creative posts
const defaultCovers = [
  '/img/fan/card-1.svg',
  '/img/fan/card-2.svg',
  '/img/fan/card-3.svg',
  '/img/fan/card-4.svg',
  '/img/fan/card-5.svg',
  '/img/fan/card-6.svg',
  '/img/fan/card-7.svg',
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
