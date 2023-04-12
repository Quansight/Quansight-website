import { FC } from 'react';

import clsx from 'clsx';

import { Picture } from '@quansight/shared/ui-components';

import arrowIcon from './assets/arrow-icon.svg';
import { TPaginationIconProps } from './types';
import { PaginationOrientation } from './types';

export const PaginationIcon: FC<TPaginationIconProps> = ({ orientation }) => {
  return (
    <div
      className={clsx(
        'relative  h-[1.5rem] w-[1.5rem]',
        orientation === PaginationOrientation.Prev && 'rotate-180',
      )}
    >
      <Picture
        imageSrc={arrowIcon}
        imageAlt={`Go to ${orientation} page`}
        layout="fill"
      />
    </div>
  );
};
