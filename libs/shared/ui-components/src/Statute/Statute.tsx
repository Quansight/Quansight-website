import { FC } from 'react';
import { TStatuteProps } from './types';
import { StatuteSection } from './StatuteSection';

export const Statute: FC<TStatuteProps> = ({ title, sections }) => (
  <article className="py-[5.4rem] px-[1.8rem] mx-auto sm:py-[6.4rem] sm:px-[4.4rem] xl:px-[21.2rem] xl:pt-[11.2rem] xl:pb-[8.6rem] max-w-layout">
    <div className="pb-[7.6rem] border-b sm:pb-[8.6rem] xl:pb-[12.6rem] border-gray">
      <h2 className="mb-[8.6rem] text-[4rem] font-extrabold leading-[4.9rem] text-center sm:mx-auto sm:max-w-[70rem] sm:text-[4.8rem] sm:leading-[5.3rem] xl:mb-[12.4rem] font-heading text-violet">
        {title}
      </h2>
      {sections.map((section) => (
        <StatuteSection {...section} key={section._uid} />
      ))}
    </div>
  </article>
);

export default Statute;
