import { ContactForm } from '../ContactForm/ContactForm';
import { Logos } from '../Logos/Logos';
import { ComponentType } from './types';

export const componentsMap = {
  [ComponentType.ContactForm]: ContactForm,
  [ComponentType.Logos]: Logos,
};
