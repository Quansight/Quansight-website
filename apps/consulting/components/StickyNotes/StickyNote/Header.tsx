import { FC } from 'react';
import clsx from 'clsx';

import { getTextColor } from './utils';

import { StickyNoteColor } from './types';

type THeaderProps = {
  variant: StickyNoteColor;
  text: string;
};

export const Header: FC<THeaderProps> = ({ variant, text }) => (
  <h2
    className={clsx(
      'mb-[3.7rem] text-[4rem] font-extrabold leading-[4.9rem] font-heading',
      'sm:text-[4.8rem]',
      getTextColor(variant),
    )}
  >
    {text}
  </h2>
);
