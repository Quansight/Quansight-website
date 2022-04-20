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
  const imageSize = isColumns ? 90 : 70;

  return (
    <div className={clsx(isColumns && 'text-center')}>
      <Picture
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        width={imageSize}
        height={imageSize}
      />
    </div>
  );
};
