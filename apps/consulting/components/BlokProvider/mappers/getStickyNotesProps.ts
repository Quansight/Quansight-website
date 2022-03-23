import { getUrl, TStickyNotesProps } from '@quansight/shared/ui-components';
import { TStickyNotesRawData } from '../../../types/storyblok/bloks/stickyNotes';

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
