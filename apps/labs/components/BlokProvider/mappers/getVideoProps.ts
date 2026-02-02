import { TVideoProps } from '@quansight/shared/ui-components';

import { TVideoRawData } from '../../../types/storyblok/bloks/video';

export const getVideoProps = (blok: TVideoRawData): TVideoProps => ({
  url: blok?.url,
  thumbnail: blok?.thumbnail,
  size: blok?.size,
  align: blok?.align,
  title: blok?.title,
  sideText: blok?.sideText,
  text: blok?.text,
  topSpace: blok?.topSpace,
  bottomSpace: blok?.bottomSpace,
});
