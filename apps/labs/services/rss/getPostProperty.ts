const getPropertyString = (contents: string, regex: RegExp): string => {
  const extractedProperty = regex.exec(contents);

  return JSON.stringify(extractedProperty);
};

export const getPostImageProperty = (
  contents: string,
  regex: RegExp,
): string => {
  const postImageroperty = getPropertyString(contents, regex);
  const trimmedImageProperty = postImageroperty
    .replace('["featuredImage:\\n  src: /', '')
    .replace('"]', '');
  return trimmedImageProperty;
};

export const getPostProperty = (
  contents: string,
  regex: RegExp,
  trim: string,
): string => {
  const postProperty = getPropertyString(contents, regex);

  return postProperty.replace(`${trim}: `, '');
};
