import { TLink } from '@quansight/shared/types';

export const getUrl = ({ linktype, cached_url, url }: TLink): string => {
  return linktype === 'story' ? `/${cached_url}` : url;
};
