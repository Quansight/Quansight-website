import { FC } from 'react';
import clsx from 'clsx';

import { getBackgroundColor, getTextColor, getTextSize } from './utils';

import {
  ButtonLink,
  ButtonColor,
  createMarkup,
} from '@quansight/shared/ui-components';

import { TStickyNoteProps } from './types';

export const StickyNote: FC<TStickyNoteProps> = ({
  title,
  variant,
  buttonLink,
  buttonText,
  description,
  descriptionSize,
}) => {
  const showButton = buttonLink && buttonText;
  return (
    <div
      className={clsx(
        'px-[2.5rem] pt-[2.8rem] pb-[3.9rem] h-full',
        'sm:px-[5.1rem] sm:pt-[4.1rem] sm:pb-[5.1rem]',
        getBackgroundColor(variant),
      )}
    >
      {title && (
        <h2
          className={clsx(
            'mb-[3.7rem] text-[4rem] font-extrabold leading-[4.9rem] font-heading',
            'sm:text-[4.8rem]',
            getTextColor(variant),
          )}
        >
          {title}
        </h2>
      )}

      <div
        className={clsx(
          'font-heading',
          getTextSize(descriptionSize),
          getTextColor(variant),
        )}
        dangerouslySetInnerHTML={createMarkup(description)}
      ></div>
      {showButton && (
        <div className="mt-[1.4rem] sm:mt-[3.8rem]">
          <ButtonLink
            isFull
            isTriangle
            url={buttonLink}
            text={buttonText}
            color={ButtonColor.White}
          />
        </div>
      )}
    </div>
  );
};
