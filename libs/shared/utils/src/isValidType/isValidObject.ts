export const isValidObject = (data: unknown) =>
  typeof data === 'object' && !Array.isArray(data) && data !== null;
