import { TTestimonialRawData } from '../../../types/storyblok/bloks/testimonial';
import { TTestimonialProps } from '../../Testimonial/types';

export const getTestimonialProps = (
  blok: TTestimonialRawData,
): TTestimonialProps => ({
  header: blok.header,
  text: blok.text,
  imageSrc: blok.image.filename,
  imageAlt: blok.image.alt,
  testimonial: blok.testimonial,
  person: blok.person,
  position: blok.position,
});
