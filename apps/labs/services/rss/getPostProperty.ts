import { PostProps } from './types';

const REG_EXP = {
  title: /title:.*/,
  description: /description:.*/,
  date: /published:.*/,
  image: /featuredImage:\n\s\ssrc:.*/,
};

const TRIM = {
  title: 'title: ',
  description: 'description: ',
  date: '["published: ',
  image: 'featuredImage:\n  src: /',
};

export const getPostProperty = (content: string, prop: PostProps): string => {
  const extractedProp = REG_EXP[prop].exec(content).toString();

  return extractedProp.replace(TRIM[prop], '');
};
