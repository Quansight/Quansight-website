import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TTriptychColumnProps } from './types';

const TriptychColumn: FC<TTriptychColumnProps> = ({
  title,
  text,
  imageSrc,
  imageAlt,
}) => (
  <div>
    <div className="">
      <Picture imageSrc={imageSrc} imageAlt={imageAlt} width={90} height={90} />
    </div>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

export default TriptychColumn;
