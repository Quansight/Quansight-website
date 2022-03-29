import { ParsedUrlQuery } from 'querystring';

export interface ISlugParams extends ParsedUrlQuery {
  slug: string;
}
