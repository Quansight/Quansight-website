export const prefixSlug = (url: string): string =>
  url === 'homepage' || url === 'home' ? '/' : `/${url}`;
