import { FC } from 'react';
import clsx from 'clsx';

import { StickyNote } from './StickyNote';
import { StickyNotesDecor } from './StickyNotesDecor';

import { getFirstNoteMargins, getLastNoteMargins } from './utils';

import { TStickyNotesProps, StickyNotesVariant } from './types';

export const StickyNotes: FC<TStickyNotesProps> = ({ variant, items }) => {
  return (
    <div className="flex relative flex-col items-stretch mx-auto sm:flex-row xl:px-[18rem] max-w-layout">
      {items.map((item, index, source) => {
        const isLast = index === source.length - 1;
        const isFirst = index === 0;

        return (
          <div
            key={item.title}
            className={clsx(
              'basis-1/2 sm:mx-0',
              isFirst && 'ml-[2rem] sm:ml-0',
              isFirst && getFirstNoteMargins(variant),
              isLast && 'mr-[2rem] sm:mr-0',
              isLast && getLastNoteMargins(variant),
            )}
          >
            <StickyNote {...item} />
          </div>
        );
      })}
      {variant === StickyNotesVariant.Asymmetric && <StickyNotesDecor />}
    </div>
  );
};
