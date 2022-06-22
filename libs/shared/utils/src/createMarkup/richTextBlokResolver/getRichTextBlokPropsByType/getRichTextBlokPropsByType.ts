import { TRichTextRawBlok } from '../richTextRawBlok/richTextRawBlok';
import { RichTextComponentType } from '../types';
import { getRichTextFigureProps } from './mappers/getRichTextFigureProps';
import { TRichTextBlokComponentProps } from './types';

export const getRichTextBlokPropsByType = (
  blok: TRichTextRawBlok,
): TRichTextBlokComponentProps => {
  switch (blok.component) {
    case RichTextComponentType.RichTextFigure: {
      return getRichTextFigureProps(blok);
    }
    default:
      return null;
  }
};
