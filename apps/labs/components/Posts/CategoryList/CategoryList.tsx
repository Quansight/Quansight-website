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
          'whitespace-nowrap px-[0.8rem] py-[0.7rem] text-[1.1rem] !font-normal !leading-[2.7rem] text-white last:mr-0',
          {
            '!text-black !bg-white': selectedCategory !== categoryName,
          },
        )}
      />
    ))}
  </div>
);
