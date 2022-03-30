import { ComponentType, TBlokComponentProps } from '../types';

import { getLogosProps } from '../mappers/getLogosProps';
import { getContactFormProps } from '../mappers/getContactFormProps';

import { TRawBlok } from '../../../types/storyblok/bloks/rawBlock';

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
