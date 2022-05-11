import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TTileProps } from './types';
import { getTileProps } from './utils/getTileProps';

export const Tile: FC<TTileProps> = ({ tile }) => {
  const { imageSrc, imageAlt, postType, title, author, date } =
    getTileProps(tile);
  return (
    <li>
      <div className="relative w-10 h-10">
        <Picture imageSrc={imageSrc} imageAlt={imageAlt} layout="fill" />
      </div>
      <p>{postType}</p>
      <h3>{title}</h3>
      <div>
        <p>{author}</p>
        <p>{date}</p>
      </div>
    </li>
  );
};
