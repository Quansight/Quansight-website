import { FC } from 'react';

import { TFormHeaderProps } from './types';

export const FormHeader: FC<TFormHeaderProps> = ({ title }) => (
  <h2
    className="
      mb-[4rem] text-[4rem] font-extrabold leading-[4.9rem] text-center 
      md:mb-[17rem] md:text-[4.8rem] md:text-left 
      text-violet font-heading
    "
  >
    {title}
  </h2>
);
