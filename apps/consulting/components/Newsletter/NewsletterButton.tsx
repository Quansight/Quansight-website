import { FC } from 'react';

import clsx from 'clsx';

import { TNewsletterButtonProps } from './types';

export const NewsletterButton: FC<TNewsletterButtonProps> = ({
  cta,
  isSubscribed,
}) => (
  <button
    className={clsx(
      'bg-pink mt-[1.2rem] w-full py-[.7rem] px-[5rem] text-[1.6rem] leading-[3.9rem] text-white',
      'md:mt-0 md:box-border md:w-[20rem] md:text-[1.8rem]',
      isSubscribed && 'pointer-events-none opacity-50',
    )}
    title={cta}
    type="submit"
  >
    {cta}
  </button>
);
