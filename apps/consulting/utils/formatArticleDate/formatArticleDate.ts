export const formatArticleDate = (publishedDate: string): string => {
  const rawDate = new Date(publishedDate.replace(/-/g, '/'));
  const date = {
    day: rawDate.getDate(),
    month: rawDate.toLocaleString('default', { month: 'long' }),
    year: rawDate.getFullYear(),
  };
  return `${date.month} ${date.day}, ${date.year}`;
};
