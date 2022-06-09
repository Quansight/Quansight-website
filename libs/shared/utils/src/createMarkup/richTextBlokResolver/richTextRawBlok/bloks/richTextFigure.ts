import { TImage } from '@quansight/shared/types';

import { RichTextComponentType } from '../../types';
import { TRawData } from '../richTextRawBlok';

export type TRichTextFigureRawData = {
  component: RichTextComponentType.RichTextFigure;
  caption: string;
  image: TImage;
} & TRawData;
