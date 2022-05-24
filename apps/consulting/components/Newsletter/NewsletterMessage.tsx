import { FC } from 'react';

import { TNewsletterMessageProps } from './types';

export const NewsletterMessage: FC<TNewsletterMessageProps> = ({ message }) => {
  if (message)
    return (
      <p
        className="
        absolute top-[-3rem] left-0 w-full text-[1.4rem] text-white
        md:top-[6rem] md:text-center
      "
      >
        {message}
      </p>
    );

  return null;
};
