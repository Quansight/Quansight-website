import { getUrl } from '@quansight/shared/utils';

import { TLogosProps } from '../../Logos/types';
import { TLogosRawData } from '../../../types/storyblok/bloks/logos';

export const getLogosProps = (blok: TLogosRawData): TLogosProps => ({
  title: blok.title,
  grid: blok.grid.map(({ alt, filename }) => ({
    imageSrc: filename,
    imageAlt: alt,
  })),
  linkTitle: blok.linkTitle,
  linkUrl: getUrl(blok.linkUrl),
});
