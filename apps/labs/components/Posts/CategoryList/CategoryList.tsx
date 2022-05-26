import { FC } from 'react';

import clsx from 'clsx';

import { Button } from '@quansight/shared/ui-components';

export type TCategoryListProps = {
  items: string[];
  onClick?: (categoryName: string) => void;
  selectedCategory?: string;
};

export const CategoryList: FC<TCategoryListProps> = ({
  items,
  onClick = () => {},
  selectedCategory,
}) => (
  <div className="flex flex-wrap">
    {items.map((categoryName) => (
      <Button
        key={categoryName}
        title={categoryName}
        onClick={() => {
          onClick(categoryName);
        }}
        className={clsx(
          'py-[0.7rem] px-[0.8rem] last:mr-0 text-[1.1rem] !font-normal !leading-[2.7rem] text-white whitespace-nowrap',
          {
            '!text-black !bg-white': selectedCategory !== categoryName,
          },
        )}
      />
    ))}
  </div>
);
