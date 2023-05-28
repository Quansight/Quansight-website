import { DomainVariant } from '@quansight/shared/types';

export type TSocialCardProps = {
  title: string;
  description: string;
  variant: DomainVariant;
  twitterCardImgUrl?: string;
  openGraphCardImgUrl?: string;
  cardImgAlt?: string;
};
