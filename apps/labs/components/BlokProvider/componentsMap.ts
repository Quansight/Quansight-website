import { ComponentType } from './types';
import { Logos } from '../Logos/Logos';
import { ContactForm } from '../ContactForm/ContactForm';

export const componentsMap = {
  [ComponentType.Logos]: Logos,
  [ComponentType.ContactForm]: ContactForm,
};
