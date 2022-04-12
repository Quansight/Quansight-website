import { getUrl } from '@quansight/shared/ui-components';

import { TLogosProps } from '@quansight/shared/ui-components';
import { TLogosRawData } from '../../../types/storyblok/bloks/logos';

export const getLogosProps = (blok: TLogosRawData): TLogosProps => ({
  title: blok.title,
  grid: blok.grid.map(({ alt, filename, ...other }) => {
    console.log(other);

    return {
      imageSrc: filename,
      imageAlt: alt,
    };
  }),
  linkTitle: blok.linkTitle,
  linkUrl: getUrl(blok.linkUrl),
  theme: blok.theme,
});
