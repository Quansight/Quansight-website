import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TColumnProps } from './types';

const Column: FC<TColumnProps> = ({ title, text, imageSrc, imageAlt }) => (
  <div>
    {/* <div>
      <Picture imageSrc={imageSrc} imageAlt={imageAlt} width={90} height={90} />
    </div>
    <h3>
      {title}
    </h3>
    <p>
      {text}
    </p> */}
    Hello
  </div>
);

export default Column;
