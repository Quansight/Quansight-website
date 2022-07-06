import { FC } from 'react';

import clsx from 'clsx';

import { Button } from './Button';
import { Description } from './Description';
import { Header } from './Header';
import { TStickyNoteComponentProps } from './types';
import {
  getBackgroundColor,
  getFirstNoteMargins,
  getLastNoteMargins,
} from './utils';

export const StickyNote: FC<TStickyNoteComponentProps> = ({
  title,
  variant,
  buttonLink,
  buttonText,
  description,
  descriptionSize,
  isFirst,
  isLast,
  notesVariant,
}) => {
  const showButton = buttonLink && buttonText;
  const noteStyle = clsx(
    'basis-1/2 px-[2.5rem] pb-[3.9rem] h-full sm:px-[5.1rem] sm:pt-[4.1rem] sm:pb-[5.1rem] sm:mx-0',
    isFirst && 'relative pt-[2.8rem] ml-[2rem] sm:ml-0 z-1',
    isLast &&
      'pt-[11.8rem] mt-[-9rem] mr-[2rem] sm:pt-[4.1rem] sm:mt-0 sm:mr-0',
    isFirst && getFirstNoteMargins(notesVariant),
    isLast && getLastNoteMargins(notesVariant),
    getBackgroundColor(variant),
  );

  return (
    <div className={noteStyle}>
      {title && <Header text={title} variant={variant} />}
      <Description
        text={description}
        size={descriptionSize}
        variant={variant}
      />
      {showButton && (
        <Button
          text={buttonText}
          linkAriaLabel={`${title} ${buttonText}`}
          link={buttonLink}
        />
      )}
    </div>
  );
};
