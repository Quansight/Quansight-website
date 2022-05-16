import { FC } from 'react';

import clsx from 'clsx';

import { TColumnArticleHeaderProps } from './types';

const commonHeaderStyles = `my-[2rem] font-extrabold text-violet font-heading`;

export const ColumnArticleHeader: FC<TColumnArticleHeaderProps> = ({
  header,
  level,
}) => {
  if (level === 3)
    return (
      <h3 className={clsx('text-[3rem] leading-[4rem]', commonHeaderStyles)}>
        {header}
      </h3>
    );

  if (level === 4)
    return (
      <h4 className={clsx('text-[3rem] leading-[4rem]', commonHeaderStyles)}>
        {header}
      </h4>
    );

  return (
    <h2
      className={clsx(
        'text-[4rem] leading-[4.9rem] md:text-[4.8rem]',
        commonHeaderStyles,
      )}
    >
      {header}
    </h2>
  );
};
