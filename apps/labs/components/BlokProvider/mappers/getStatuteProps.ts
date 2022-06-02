import { TStatuteProps } from '@quansight/shared/ui-components';

import { TStatuteRawData } from '../../../types/storyblok/bloks/statute';

export const getStatuteProps = (blok: TStatuteRawData): TStatuteProps => ({
  title: blok.title,
  sections: blok.sections,
});
