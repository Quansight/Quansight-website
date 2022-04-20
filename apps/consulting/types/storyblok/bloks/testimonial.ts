import { TBlok, TImage } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TTestimonialRawData = {
  component: ComponentType.Testimonial;
  header: string;
  text: string;
  image: TImage;
  testimonial: string;
  person: string;
  position: string;
} & TBlok;
