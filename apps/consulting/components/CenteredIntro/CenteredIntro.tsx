import { FC } from 'react';

import { TCenteredIntroProps } from './types';

export const CenteredIntro: FC<TCenteredIntroProps> = ({
  title,
  description,
}) => (
  <section className="max-w-layout mx-auto px-8 py-[7.4rem]">
    <h2 className="font-heading text-violet mb-[1.9rem] text-center text-[4rem] font-extrabold leading-[4.9rem] sm:mb-[2.5rem] sm:text-[4.8rem]">
      {title}
    </h2>
    <p className="mx-auto max-w-[57rem] text-center text-[2rem] font-normal leading-[3rem] sm:text-[2.2rem]">
      {description}
    </p>
  </section>
);

export default CenteredIntro;
