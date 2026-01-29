export const authorsToString = (authors) => {
  const { length } = authors;
  const fullNames = authors.map(({ fullName }) => fullName);
  switch (length) {
    case 1:
      return fullNames[0];
    case 2:
      return fullNames[0] + ' & ' + fullNames[1];
    default:
      return (
        fullNames.slice(0, length - 1).join(', ') +
        ' & ' +
        fullNames[length - 1]
      );
  }
};
