import { TCenteredIntroProps } from '@quansight/shared/ui-components';

import { TCenteredIntroRawData } from '../../../types/storyblok/bloks/centeredIntro';

export const getCenteredIntroProps = (
  blok: TCenteredIntroRawData,
): TCenteredIntroProps => ({
  title: blok.title,
  description: blok.description,
});
