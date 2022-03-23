import { FC } from 'react';
import clsx from 'clsx';
import ButtonLink from '../../ButtonLink/ButtonLink';
import { ButtonColor } from '../../ButtonLink/types';
import { TStickyNoteProps } from '../types';
import { getBackgroundColor, getTextColor } from './utils';

export const StickyNote: FC<TStickyNoteProps> = ({
  title,
  variant,
  buttonLink,
  buttonText,
  description,
}) => {
  const showButton = buttonLink && buttonText;
  return (
    <div
      className={clsx(
        'px-[5.1rem] pt-[4.1rem] pb-[5.1rem]',
        getBackgroundColor(variant),
      )}
    >
      <h2
        className={clsx(
          'mb-[3.7rem] text-[4.8rem] leading-[4.9rem] font-heading',
          getTextColor(variant),
        )}
      >
        {title}
      </h2>

      <p
        className={clsx(
          'text-[2.5rem] leading-[3.3rem] font-heading',
          getTextColor(variant),
          {
            'mb-[3.8rem]': showButton,
          },
        )}
      >
        {description}
      </p>

      {showButton && (
        <ButtonLink
          isFull
          isTriangle
          url={buttonLink}
          text={buttonText}
          color={ButtonColor.White}
        />
      )}
    </div>
  );
};
