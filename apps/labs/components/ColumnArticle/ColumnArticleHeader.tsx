import { FC } from 'react';

import clsx from 'clsx';

import { TColumnArticleHeaderProps } from './types';

const commonHeaderStyles = `mb-[2.5rem] font-extrabold text-violet font-heading`;

export const ColumnArticleHeader: FC<TColumnArticleHeaderProps> = ({
  header,
  level,
  className,
}) => {
  if (level === 2) {
    return (
      <h2
        className={clsx(
          'text-[4rem] leading-[4.9rem] md:text-[4.8rem]',
          commonHeaderStyles,
          className,
        )}
      >
        {header}
      </h2>
    );
  }

  return (
    <h3
      className={clsx(
        'text-[3rem] leading-[4rem]',
        commonHeaderStyles,
        className,
      )}
    >
      {header}
    </h3>
  );
};
