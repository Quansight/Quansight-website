import { FC } from 'react';

import clsx from 'clsx';

import { Picture } from '@quansight/shared/ui-components';

import { ColumnsVariant } from '../types';
import { TColumnImageComponentProps } from './types';

export const ColumnImage: FC<TColumnImageComponentProps> = ({
  variant,
  imageSrc,
  imageAlt,
}) => {
  const isColumns = variant === ColumnsVariant.Columns;

  return (
    <div
      className={clsx(
        'relative',
        isColumns ? 'h-[9rem]' : 'h-[7rem]',
        isColumns && 'text-center',
      )}
    >
      <Picture
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
};
