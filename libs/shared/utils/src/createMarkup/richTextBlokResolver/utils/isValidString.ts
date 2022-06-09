import { Maybe } from 'graphql/jsutils/Maybe';

export const isValidString = (value: Maybe<string>): boolean =>
  !!value && typeof value === 'string' && !!value.replace(/\s+/g, '');
