import { ComponentType } from './types';
import { ContactForm } from '../ContactForm/ContactForm';
import { Logos } from '@quansight/shared/ui-components';

export const componentsMap = {
  [ComponentType.ContactForm]: ContactForm,
  [ComponentType.Logos]: Logos,
};
