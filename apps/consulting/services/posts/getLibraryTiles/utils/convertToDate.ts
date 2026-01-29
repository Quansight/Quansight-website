export const convertToDate = (date: string): number =>
  date ? new Date(date).getTime() : new Date().getTime();
