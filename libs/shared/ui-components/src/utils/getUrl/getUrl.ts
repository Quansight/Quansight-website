import { TLink } from '@quansight/shared/config';

export const getUrl = ({ linktype, cached_url, url }: TLink): string => {
  return linktype === 'story' ? `/${cached_url}` : url;
};
