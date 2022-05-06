import { TCenteredIntroRawData } from '../../../types/storyblok/bloks/centeredIntro';
import { TCenteredIntroProps } from '../../CenteredIntro/types';

export const getCenteredIntroProps = (
  blok: TCenteredIntroRawData,
): TCenteredIntroProps => ({
  title: blok.title,
  description: blok.description,
});
