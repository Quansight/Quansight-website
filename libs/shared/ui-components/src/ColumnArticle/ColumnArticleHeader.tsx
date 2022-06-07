import { FC } from 'react';

import clsx from 'clsx';

import { TColumnArticleHeaderProps } from './types';

const headerStyles = {
  common: 'my-[2rem] font-extrabold text-violet font-heading',
  small: 'text-[3rem] leading-[4rem]',
  big: 'text-[4rem] leading-[4.9rem] md:text-[4.8rem]',
};

export const ColumnArticleHeader: FC<TColumnArticleHeaderProps> = ({
  header,
  level,
}) => {
  if (level === 3)
    return (
      <h3 className={clsx(headerStyles.common, headerStyles.small)}>
        {header}
      </h3>
    );

  if (level === 4)
    return (
      <h4 className={clsx(headerStyles.common, headerStyles.small)}>
        {header}
      </h4>
    );

  return (
    <h2 className={clsx(headerStyles.common, headerStyles.big)}>{header}</h2>
  );
};
