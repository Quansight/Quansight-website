import { Maybe } from 'graphql/jsutils/Maybe';

export const isValidString = (value: Maybe<string>): boolean => {
  if (!!value && typeof value === 'string') {
    return !!value.replace(/\s+/g, '');
  }

  return false;
};
