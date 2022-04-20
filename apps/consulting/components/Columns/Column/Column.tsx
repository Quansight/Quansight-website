import { FC } from 'react';
import clsx from 'clsx';

import { ColumnImage } from './ColumnImage';
import { ColumnLink } from './ColumnLink';

import { TColumnComponentProps, ColumnsVariant } from '../types';

export const Column: FC<TColumnComponentProps> = ({
  variant,
  title,
  text,
  imageSrc,
  imageAlt,
  linkText,
  linkUrl,
}) => (
  <div
    className={clsx(
      'mb-[3.5rem] lg:w-1/3',
      variant === ColumnsVariant.Tiles &&
        `py-[3.5rem] px-[2rem] shadow-[0_4px_14px_rgba(0,0,0,.11)]
      lg:px-[3rem] lg:pt-[6.4rem]`,
    )}
  >
    <ColumnImage variant={variant} imageSrc={imageSrc} imageAlt={imageAlt} />
    <h3
      className="
        my-[1.8rem] text-[2.7rem] font-extrabold leading-[3.5rem] text-black 
        lg:mt-[2.6rem]
      "
    >
      {title}
    </h3>
    <p className="text-[1.6rem] leading-[2.7rem] text-black">{text}</p>
    <ColumnLink linkText={linkText} linkUrl={linkUrl} />
  </div>
);
