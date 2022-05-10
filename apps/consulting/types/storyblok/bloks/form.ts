import { TRichText, TLink, TImage, TBlok } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';

export type TFormRawData = {
  component: ComponentType.Form;
  hookUrl: TLink;
  image: TImage;
  title: string;
  errorMessage: string;
  thanksMessage: TRichText;
} & TBlok;
