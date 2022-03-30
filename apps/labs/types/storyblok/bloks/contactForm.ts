import { TBlok } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TContactFormRawData = {
  component: ComponentType.ContactForm;
  title: string;
} & TBlok;
