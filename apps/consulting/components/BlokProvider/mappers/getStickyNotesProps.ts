import { TStickyNotesProps } from '../../StickyNotes/types';
import { TStickyNotesRawData } from '../../../types/storyblok/bloks/stickyNotes';
import { getUrl } from '@quansight/shared/ui-components';

export const getStickyNotesProps = (
  data: TStickyNotesRawData,
): TStickyNotesProps => ({
  items: data.items.map((item) => ({
    title: item.title,
    description: item.description,
    buttonText: item.buttonText,
    variant: item.variant,
    buttonLink: getUrl(item.link),
  })),
});
