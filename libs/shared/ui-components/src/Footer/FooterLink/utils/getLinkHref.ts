export const getLinkHref = (url: string, queryString?: string): string =>
  queryString ? `${url}${queryString}` : `${url}`;
