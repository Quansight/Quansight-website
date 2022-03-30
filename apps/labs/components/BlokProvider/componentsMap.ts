import { ComponentType } from './types';
import { ContactForm } from '../ContactForm/ContactForm';
import { Logos } from '../Logos/Logos';

export const componentsMap = {
  [ComponentType.ContactForm]: ContactForm,
  [ComponentType.Logos]: Logos,
};
