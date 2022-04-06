import { FC } from 'react';

export const StickyNotesDecor: FC = () => (
  <div
    className="
      flex absolute right-[3rem] bottom-[-5rem] z-[1] justify-center items-center w-[10rem]
      h-[10rem] border border-solid rotate-45 sm:right-[2.5rem]
      sm:bottom-[-3rem] xl:right-[15rem] border-violet
      sm:border-green
    "
  >
    <div className="w-[73%] h-[73%] rotate-45 bg-violet"></div>
  </div>
);
