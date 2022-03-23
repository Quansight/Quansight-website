import { FC } from 'react';
import clsx from 'clsx';
import { StickyNote } from './StickyNote/StickyNote';
import { TStickyNotesProps } from './types';

export const StickyNotes: FC<TStickyNotesProps> = ({ items }) => {
  return (
    <div className="flex relative flex-row items-stretch">
      {items.map((item, index, source) => (
        <div
          className={clsx('basis-1/2', {
            'mt-[4.5rem]': index === source.length - 1,
          })}
        >
          <StickyNote {...item} />
        </div>
      ))}
      <div className="flex absolute right-[-3rem] bottom-[-3rem] z-[1] justify-center items-center w-[10rem] h-[10rem] border border-solid rotate-45 border-green">
        <div className="w-[73%] h-[73%] rotate-45 bg-violet"></div>
      </div>
    </div>
  );
};
