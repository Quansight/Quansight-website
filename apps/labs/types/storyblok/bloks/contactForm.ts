import { TBlok } from '@quansight/shared/ui-components';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TContactFormRawData = {
  component: ComponentType.ContactForm;
  title: string;
} & TBlok;
