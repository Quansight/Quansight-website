import { DomainVariant } from '@quansight/shared/types';

export type TSocailCardProps = {
  title: string;
  description: string;
  variant: DomainVariant;
  twitterCardImgUrl?: string;
  openGraphCardImgUrl?: string;
  cardImgAlt?: string;
};
