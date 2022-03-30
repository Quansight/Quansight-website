import { TypeValuesUnion } from '@quansight/shared/types';

import { TContactFormProps } from '../ContactForm/ContactForm';
import { TLogosProps } from '../Logos/types';

export enum ComponentType {
  Logos = 'logos',
  ContactForm = 'contact-form',
}

type TBlokComponentPropsMap = {
  [ComponentType.ContactForm]: TContactFormProps;
  [ComponentType.Logos]: TLogosProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
