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
        'px-[2.5rem] pt-[2.8rem] pb-[3.9rem] sm:px-[5.1rem] sm:pt-[4.1rem] sm:pb-[5.1rem]',
        getBackgroundColor(variant),
      )}
    >
      <h2
        className={clsx(
          'mb-[3.7rem] text-[4rem] font-extrabold leading-[4.9rem] sm:text-[4.8rem] font-heading',
          getTextColor(variant),
        )}
      >
        {title}
      </h2>

      <p
        className={clsx(
          'text-[2rem] font-bold leading-[2.8rem] sm:text-[2.5rem] sm:leading-[3.3rem] font-heading',
          getTextColor(variant),
          {
            'mb-[1.4rem] sm:mb-[3.8rem]': showButton,
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
