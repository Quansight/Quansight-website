import { TLogosProps } from '@quansight/shared/ui-components';
import { getUrl } from '@quansight/shared/utils';


import { TLogosRawData } from '../../../types/storyblok/bloks/logos';

export const getLogosProps = (blok: TLogosRawData): TLogosProps => ({
  colorVariant: blok.colorVariant,
  title: blok.title,
  grid: blok.grid.map(({ alt, filename }) => ({
    imageSrc: filename,
    imageAlt: alt,
  })),
  linkTitle: blok.linkTitle,
  linkUrl: getUrl(blok.linkUrl),
});
