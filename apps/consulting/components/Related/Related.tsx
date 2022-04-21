import { FC } from 'react';

import { RelatedItem } from './RelatedItem';

import { TRelatedProps } from './types';

export const Related: FC<TRelatedProps> = ({ title, items }) => (
  <section
    className="
      py-[7rem] px-[3.5rem] mx-auto lg:px-[13rem] 
      lg:pt-[11rem] max-w-layout
    "
  >
    <h2
      className="
        mb-[5rem] text-[4rem] font-extrabold leading-[4.9rem] text-center lg:mb-[8rem] 
        lg:text-[4.8rem] font-heading
        text-violet
      "
    >
      {title}
    </h2>
    <ul className="md:flex md:gap-[2rem] lg:gap-[3.4rem] xl:px-[13rem]">
      {items.map((props) => (
        <RelatedItem {...props} key={props._uid} />
      ))}
    </ul>
  </section>
);
