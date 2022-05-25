import { TPageHeadingRawData } from '../../../types/storyblok/bloks/pageHeading';
import { TPageHeadingProps } from '../../PageHeading/types';

export const getPageHeadingProps = (
  blok: TPageHeadingRawData,
): TPageHeadingProps => ({
  title: blok.title,
  description: blok.description,
});
