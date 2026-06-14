import type { FC } from 'react';

import { md } from '../../utils/markdown';

type StatuteSectionProps = {
  title: string;
  text: string;
};

export const StatuteSection: FC<StatuteSectionProps> = ({ title, text }) => (
  <section className="px-[1.8rem] mb-[4.1rem] last:mb-0 xl:px-[4.4rem]">
    <h3 className="mb-[1.8rem] text-[2.7rem] font-extrabold leading-[3.5rem] text-black sm:mb-[2.2rem] sm:text-[3.2rem] xl:mb-[2.5rem] xl:leading-[5.3rem] font-heading">
      {title}
    </h3>
    <div
      className="min-w-full text-[1.6rem] text-black marker:text-black prose sm:text-[1.8rem] xl:leading-[2.7rem]"
      dangerouslySetInnerHTML={md(text)}
    />
  </section>
);
