export const getAuthorName = (firstName = '', lastName = ''): string => {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName && !lastName) return firstName;
  if (!firstName && lastName) return lastName;
  return '';
};
