import { FC } from 'react';

import clsx from 'clsx';

import { TNewsletterButtonProps } from './types';

export const NewsletterButton: FC<TNewsletterButtonProps> = ({
  cta,
  isSubscribed,
}) => (
  <button
    className={clsx(
      'py-[.7rem] px-[5rem] mt-[1.2rem] w-full text-[1.6rem] leading-[3.9rem] text-white bg-pink',
      'md:box-border md:mt-0 md:w-[20rem] md:text-[1.8rem]',
      isSubscribed && 'opacity-50 pointer-events-none',
    )}
    title={cta}
    type="submit"
  >
    {cta}
  </button>
);
