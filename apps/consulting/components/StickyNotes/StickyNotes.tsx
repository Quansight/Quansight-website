import { FC } from 'react';

import { StickyNote } from './StickyNote/StickyNote';
import { StickyNotesDecor } from './StickyNotesDecor';

import { TStickyNotesProps, StickyNotesVariant } from './types';

export const StickyNotes: FC<TStickyNotesProps> = ({ variant, items }) => {
  return (
    <div className="flex relative flex-col items-stretch mx-auto sm:flex-row xl:px-[18rem] max-w-layout">
      {items.map((item, index, source) => (
        <StickyNote
          key={item.title}
          notesVariant={variant}
          isFirst={index === 0}
          isLast={index === source.length - 1}
          {...item}
        />
      ))}
      {variant === StickyNotesVariant.Asymmetric && <StickyNotesDecor />}
    </div>
  );
};
