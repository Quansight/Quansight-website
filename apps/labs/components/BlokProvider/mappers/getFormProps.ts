import { TFormProps } from '@quansight/shared/ui-components';
import { getUrl } from '@quansight/shared/utils';

import { TFormRawData } from '../../../types/storyblok/bloks/form';

export const getFormProps = (blok: TFormRawData): TFormProps => ({
  hookUrl: blok.hookUrl ? getUrl(blok.hookUrl) : '',
  imageSrc: blok.image.filename,
  imageAlt: blok.image.alt,
  title: blok.title,
  errorMessage: blok.errorMessage,
  failureMessage: blok.failureMessage,
  thanksMessage: blok.thanksMessage,
});
