export const isValidString = (data: unknown) =>
  typeof data === 'string' && data.length > 0;
