import { TypeValuesUnion } from '@quansight/shared/types';

import { TRichTextFigureProps } from '../richTextBloks/RichTextFigure/types';
import { RichTextComponentType } from '../types';

type TRochTextBlokComponetnPropsMap = {
  [RichTextComponentType.RichTextFigure]: TRichTextFigureProps;
};

export type TRichTextBlokComponentProps =
  TypeValuesUnion<TRochTextBlokComponetnPropsMap> | null;
