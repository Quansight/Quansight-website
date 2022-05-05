import { getUrl } from '@quansight/shared/utils';

import { TStickyNotesRawData } from '../../../types/storyblok/bloks/stickyNotes';
import { TStickyNotesProps } from '../../StickyNotes/types';

export const getStickyNotesProps = (
  data: TStickyNotesRawData,
): TStickyNotesProps => ({
  variant: data.variant,
  items: data.items.map((item) => ({
    title: item.title,
    description: item.description,
    descriptionSize: item.descriptionSize,
    buttonText: item.buttonText,
    variant: item.variant,
    buttonLink: getUrl(item.link),
  })),
});
