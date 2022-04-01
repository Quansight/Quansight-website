import { FC } from 'react';
import clsx from 'clsx';
import { StickyNote } from './StickyNote/StickyNote';
import { TStickyNotesProps } from './types';

export const StickyNotes: FC<TStickyNotesProps> = ({ items }) => {
  return (
    <div
      className="
        flex relative flex-col items-stretch mx-auto sm:flex-row 
        xl:px-[18rem]
        max-w-layout
      "
    >
      {items.map((item, index, source) => {
        const isLastElement = index === source.length - 1;
        const isFirstElement = index === 0;
        return (
          <div
            className={clsx('basis-1/2 sm:mx-0', {
              'sm:mt-[4.5rem]': isLastElement,
              'mr-[2rem]': isFirstElement,
              'ml-[2rem]': isLastElement,
            })}
            key={item.title}
          >
            <StickyNote {...item} />
          </div>
        );
      })}
      <div
        className="
          flex absolute right-[3rem] bottom-[-5rem] z-[1] justify-center items-center w-[10rem] h-[10rem] border border-solid rotate-45 sm:right-[2.5rem]
          sm:bottom-[-3rem] xl:right-[15rem] border-violet
          sm:border-green
        "
      >
        <div className="w-[73%] h-[73%] rotate-45 bg-violet"></div>
      </div>
    </div>
  );
};
