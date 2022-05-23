import { FC } from 'react';

import { TNewsletterButtonProps } from './types';

export const NewsletterButton: FC<TNewsletterButtonProps> = ({ cta }) => (
  <button
    className="
      py-[.7rem] px-[5rem] mt-[1.2rem] w-full text-[1.6rem] leading-[3.9rem] text-white
      md:box-border md:mt-0 md:w-[20rem] md:text-[1.8rem]
      bg-pink
    "
    title={cta}
    type="submit"
  >
    {cta}
  </button>
);
