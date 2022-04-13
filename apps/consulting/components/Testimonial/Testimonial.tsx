import { FC } from 'react';
import { Picture } from '@quansight/shared/ui-components';

import { TTestimonialProps } from './types';

export const Testimonial: FC<TTestimonialProps> = ({
  header,
  text,
  imageSrc,
  imageAlt,
  testimonial,
  person,
  position,
}) => {
  return (
    <section>
      <h2>{header}</h2>
      <p>{text}</p>
      <div>
        <div>
          <div>{/* <Picture src={imageSrc} alt={imageAlt} /> */}</div>
          <p>{testimonial}</p>
          <p>{person}</p>
          <p>{position}</p>
        </div>
      </div>
    </section>
  );
};
