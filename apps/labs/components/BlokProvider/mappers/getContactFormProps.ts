import { TContactFormRawData } from '../../../types/storyblok/bloks/contactForm';
import { TContactFormProps } from '../../ContactForm/ContactForm';

export const getContactFormProps = (
  blok: TContactFormRawData,
): TContactFormProps => ({
  title: blok.title,
});
