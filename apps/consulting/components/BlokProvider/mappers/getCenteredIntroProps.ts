import { TCenteredIntroProps } from '../../CenteredIntro/types';
import { TCenteredIntroRawData } from '../../../types/storyblok/bloks/centeredIntro';

export const getCenteredIntroProps = (
  blok: TCenteredIntroRawData,
): TCenteredIntroProps => ({
  title: blok.title,
  description: blok.description,
});
