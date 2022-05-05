import { TRawBlok } from '../../../types/storyblok/bloks/rawBlock';
import { getContactFormProps } from '../mappers/getContactFormProps';
import { getLogosProps } from '../mappers/getLogosProps';
import { ComponentType, TBlokComponentProps } from '../types';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.Logos: {
      return getLogosProps(blok);
    }
    case ComponentType.ContactForm: {
      return getContactFormProps(blok);
    }
    default:
      return null;
  }
};
