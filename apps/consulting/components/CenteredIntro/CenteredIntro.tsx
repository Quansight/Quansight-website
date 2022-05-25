import { FC } from 'react';

import { TCenteredIntroProps } from './types';

export const CenteredIntro: FC<TCenteredIntroProps> = ({
  title,
  description,
}) => (
  <section className="py-[7.4rem] px-8 mx-auto max-w-layout">
    <h2 className="mb-[1.9rem] text-[4rem] font-extrabold leading-[4.9rem] text-center sm:mb-[2.5rem] sm:text-[4.8rem] font-heading text-violet">
      {title}
    </h2>
    <p className="mx-auto max-w-[57rem] text-[2rem] font-normal leading-[3rem] text-center sm:text-[2.2rem]">
      {description}
    </p>
  </section>
);

export default CenteredIntro;
