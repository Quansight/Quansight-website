import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TTileProps } from './types';
import { formatDateToTile } from './utils/formatDateToTile';
import { getAuthorFullName } from './utils/getAuthorFullName';

export const Tile: FC<TTileProps> = ({ tile }) => {
  console.log(tile);

  return (
    <li>
      <div className="relative w-10 h-10">
        <Picture
          imageSrc={tile.content.postImage.filename}
          imageAlt={tile.content.postImage.alt}
          layout="fill"
        />
      </div>
      <p>{tile.content.category}</p>
      <h3>{tile.content.postTitle}</h3>
      <div>
        <p>{getAuthorFullName(tile)}</p>
        <p>{formatDateToTile(tile)}</p>
      </div>
    </li>
  );
};
