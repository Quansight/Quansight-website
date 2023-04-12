import { FC } from 'react';

import { createMarkup } from '@quansight/shared/utils';

import { TStatuteSectionProps } from './types';

export const StatuteSection: FC<TStatuteSectionProps> = ({ title, text }) => {
  return (
    <section className="mb-[4.1rem] px-[1.8rem] last:mb-0 xl:px-[4.4rem]">
      <h3 className="font-heading mb-[1.8rem] text-[2.7rem] font-extrabold leading-[3.5rem] text-black sm:mb-[2.2rem] sm:text-[3.2rem] xl:mb-[2.5rem] xl:leading-[5.3rem]">
        {title}
      </h3>
      <div
        className="prose min-w-full text-[1.6rem] text-black marker:text-black sm:text-[1.8rem] xl:leading-[2.7rem]"
        dangerouslySetInnerHTML={createMarkup(text)}
      />
    </section>
  );
};

export default StatuteSection;
