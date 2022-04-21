import { TTermsAndConditionsProps } from '@quansight/shared/ui-components';
import { TTermsAndConditionsRawData } from '../../../types/storyblok/bloks/termsAndConditions';

export const getTermsAndConditionsProps = (
  blok: TTermsAndConditionsRawData,
): TTermsAndConditionsProps => ({
  title: blok.title,
  paragraphs: blok.paragraphs,
});
