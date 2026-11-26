// 10 custom cartoon/editorial SVG covers tailored for Mondrian blog cards
const defaultCovers = [
  '/img/blog/cover-1.svg',
  '/img/blog/cover-2.svg',
  '/img/blog/cover-3.svg',
  '/img/blog/cover-4.svg',
  '/img/blog/cover-5.svg',
  '/img/blog/cover-6.svg',
  '/img/blog/cover-7.svg',
  '/img/blog/cover-8.svg',
  '/img/blog/cover-9.svg',
  '/img/blog/cover-10.svg',
];

export function getPostCover(_explicitCover?: string, title = '', index = 0, _body?: string): string {
  if (title) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
    }
    return defaultCovers[(hash + index) % defaultCovers.length];
  }
  return defaultCovers[index % defaultCovers.length];
}
