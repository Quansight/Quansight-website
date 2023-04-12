import { FC } from 'react';

import Link from 'next/link';

import { Picture } from '@quansight/shared/ui-components';

import { TRelatedItemProps } from './types';

export const RelatedItem: FC<TRelatedItemProps> = ({
  title,
  imageSrc,
  imageAlt,
  linkUrl,
}) => (
  <li className="mb-[3.5rem] shadow-[0_4px_14px_rgba(0,0,0,.11)] md:w-1/3">
    <Link href={linkUrl}>
      <a className="box-border block h-full px-[6rem] pb-[5rem] pt-[3rem] text-center md:px-0">
        <Picture
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          width={90}
          height={90}
        />
        <h3
          className="
            font-heading mt-[2.5rem] text-[2.2rem] font-extrabold leading-[3rem] 
            md:mx-auto md:max-w-[15rem]
          "
        >
          {title}
        </h3>
      </a>
    </Link>
  </li>
);
