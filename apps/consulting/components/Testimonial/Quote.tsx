import { FC } from 'react';
import { Picture } from '@quansight/shared/ui-components';

import { TQuoteProps } from './types';

export const Quote: FC<TQuoteProps> = ({
  imageSrc,
  imageAlt,
  testimonial,
  person,
  position,
}) => (
  <div>
    <div>
      <div className="relative w-[10rem] h-[10rem]">
        <Picture src={imageSrc} alt={imageAlt} layout="fill" />
      </div>
      <div>
        <p>{testimonial}</p>
        <p>{person}</p>
        <p>{position}</p>
      </div>
    </div>
  </div>
);
