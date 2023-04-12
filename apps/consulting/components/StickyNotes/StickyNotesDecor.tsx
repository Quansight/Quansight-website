import { FC } from 'react';

export const StickyNotesDecor: FC = () => (
  <div
    className="
      border-violet sm:border-green absolute right-[3rem] bottom-[-5rem] z-[1] flex h-[10rem]
      w-[10rem] rotate-45 items-center justify-center border
      border-solid sm:right-[2.5rem] sm:bottom-[-3rem]
      xl:right-[15rem]
    "
  >
    <div className="bg-violet h-[73%] w-[73%] rotate-45"></div>
  </div>
);
