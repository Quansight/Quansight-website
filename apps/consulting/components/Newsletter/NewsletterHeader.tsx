import { FC } from 'react';

import { TNewsletterHeaderProps } from './types';

export const NewsletterHeader: FC<TNewsletterHeaderProps> = ({ text }) => (
  <h2
    className="
      mb-[5.2rem] text-[2.2rem] leading-[2.9rem] text-center text-white 
      md:mb-[3.3rem]
    "
  >
    {text}
  </h2>
);
