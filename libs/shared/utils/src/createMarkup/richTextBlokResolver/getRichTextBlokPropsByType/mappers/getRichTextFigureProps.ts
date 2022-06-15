import { TRichTextFigureProps } from '../../richTextBloks/RichTextFigure/types';
import { TRichTextFigureRawData } from '../../richTextRawBlok/bloks/richTextFigure';

export const getRichTextFigureProps = (
  blok: TRichTextFigureRawData,
): TRichTextFigureProps => ({
  caption: blok?.caption,
  imageAlt: blok?.image?.alt,
  imageSrc: blok?.image?.filename,
});
