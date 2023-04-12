import { FC } from 'react';

import { StatuteSection } from './StatuteSection';
import { TStatuteProps } from './types';

export const Statute: FC<TStatuteProps> = ({ title, sections }) => (
  <article className="max-w-layout mx-auto px-[1.8rem] py-[5.4rem] sm:px-[4.4rem] sm:py-[6.4rem] xl:px-[21.2rem] xl:pb-[8.6rem] xl:pt-[11.2rem]">
    <div className="border-b border-gray-100 pb-[7.6rem] sm:pb-[8.6rem] xl:pb-[12.6rem]">
      <h2 className="font-heading text-violet mb-[8.6rem] text-center text-[4rem] font-extrabold leading-[4.9rem] sm:mx-auto sm:max-w-[70rem] sm:text-[4.8rem] sm:leading-[5.3rem] xl:mb-[12.4rem]">
        {title}
      </h2>
      {sections.map((section) => (
        <StatuteSection {...section} key={section._uid} />
      ))}
    </div>
  </article>
);

export default Statute;
