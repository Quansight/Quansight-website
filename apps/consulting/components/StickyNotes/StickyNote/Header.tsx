import { FC } from 'react';

import clsx from 'clsx';

import { StickyNoteColor } from './types';
import { getTextColor } from './utils';

type THeaderProps = {
  variant: StickyNoteColor;
  text: string;
};

export const Header: FC<THeaderProps> = ({ variant, text }) => (
  <h2
    className={clsx(
      'font-heading mb-[3.7rem] text-[4rem] font-extrabold leading-[4.9rem]',
      'sm:text-[4.8rem]',
      getTextColor(variant),
    )}
  >
    {text}
  </h2>
);
