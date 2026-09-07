import type { FC } from 'react';
import { md } from '../utils/markdown';

type IconListProps = {
  items: string[];
};

export const IconList: FC<IconListProps> = ({ items }) => (
  <ul className="list-disc pl-[2rem]">
    {items.map((item) => (
      <li
        className="mb-[1rem] text-[1.5rem] leading-[2.4rem] text-black"
        dangerouslySetInnerHTML={md(item)}
      />
    ))}
  </ul>
);
