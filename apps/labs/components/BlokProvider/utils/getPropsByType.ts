import { ComponentType, TBlokComponentProps } from '../types';

import { getLogosProps } from '../mappers/getLogosProps';

import { TRawBlok } from '../../../types/storyblok/bloks/rawBlock';
import { getContactFormProps } from '../mappers/getContactFormProps';

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
