export const isValidArray = (arrData: unknown) =>
  Array.isArray(arrData) && arrData.length > 0;

export const isValidObject = (data: unknown) =>
  typeof data === 'object' && !Array.isArray(data) && data !== null;

export const isValidString = (data: unknown) =>
  typeof data === 'string' && data.length > 0;
