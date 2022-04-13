import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TColumnProps } from './types';

const Column: FC<TColumnProps> = ({ title, text, imageSrc, imageAlt }) => (
  <div className="pb-[3.5rem] lg:w-1/3 border-box">
    <div className="text-center">
      <Picture imageSrc={imageSrc} imageAlt={imageAlt} width={90} height={90} />
    </div>
    <h3 className="my-[1.8rem] text-[2.7rem] font-extrabold leading-[3.5rem] text-black lg:mt-[2.6rem]">
      {title}
    </h3>
    <p className="text-[1.6rem] leading-[2.7rem] text-black">{text}</p>
  </div>
);

export default Column;
