import { FC } from 'react';

import clsx from 'clsx';

import { ButtonColor, ButtonLink } from '@quansight/shared/ui-components';

import { TBoardButtonProps } from './types';

const BoardButton: FC<TBoardButtonProps> = ({
  buttonTitle,
  buttonUrl,
  classNameBorder,
}) => {
  return (
    <div
      className={clsx(
        'z-10 mx-auto mt-[6.5rem] sm:flex sm:justify-center sm:items-center sm:mx-0 sm:mt-0',
        classNameBorder,
      )}
    >
      <ButtonLink
        isFull
        isTriangle
        text={buttonTitle}
        url={buttonUrl}
        color={ButtonColor.White}
      />
    </div>
  );
};

export default BoardButton;
