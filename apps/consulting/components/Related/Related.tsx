import { FC } from 'react';

import { RelatedItem } from './RelatedItem';
import { TRelatedProps } from './types';

export const Related: FC<TRelatedProps> = ({ title, items }) => (
  <section
    className="
      max-w-layout mx-auto px-[3.5rem] py-[7rem] 
      lg:px-[13rem] lg:pt-[11rem]
    "
  >
    <h2
      className="
        font-heading text-violet mb-[5rem] text-center text-[4rem] font-extrabold 
        leading-[4.9rem] lg:mb-[8rem]
        lg:text-[4.8rem]
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
