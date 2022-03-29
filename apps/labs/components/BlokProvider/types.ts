import { TypeValuesUnion } from '@quansight/shared/ui-components';
import { TContactFormProps } from '../ContactForm/ContactForm';

import { TLogosProps } from '../Logos/Logos';

export enum ComponentType {
  Logos = 'logos',
  ContactForm = 'contact-form',
}

type TBlokComponentPropsMap = {
  [ComponentType.Logos]: TLogosProps;
  [ComponentType.ContactForm]: TContactFormProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
