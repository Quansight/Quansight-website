import { FC } from 'react';

import { TFormHeaderProps } from './types';

export const FormHeader: FC<TFormHeaderProps> = ({ title }) => (
  <h2
    className="
      text-violet font-heading mb-[5.6rem] text-center text-[4rem] 
      font-extrabold leading-[4.9rem] md:mb-[6.8rem] 
      md:text-left md:text-[4.8rem]
    "
  >
    {title}
  </h2>
);
