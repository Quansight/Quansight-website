import { TLibraryIntroProps } from '../../LibraryIntro/types';
import { TLibraryIntroRawData } from '../../../types/storyblok/bloks/libraryIntro';

export const getLibraryIntroProps = (
  blok: TLibraryIntroRawData,
): TLibraryIntroProps => ({
  title: blok.title,
  description: blok.description,
});
