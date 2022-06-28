import { RichTextComponentType } from '../types';
import { RichTextFigure } from './RichTextFigure/RichTextFigure';

export const richTextBloksMap = {
  [RichTextComponentType.RichTextFigure]: RichTextFigure,
};
