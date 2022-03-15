import { FC } from 'react';
import { BlokProvider } from '../BlokProvider/BlokProvider';
import Image from 'next/image';
import { TQconsultingItemProps } from '../QconsultingItem/QconsultingItem';
import { TQconsultingBtnProps } from '../QconsultingBtn/QconsultingBtn';
import { TConsultingBlok } from '../BlokProvider/types';
import { TRichText } from '../../types/storyblok/richTextTypes';
import { createMarkup } from '../../services/createMarkup/createMarkup';

export type TQconsultingProps = {
  title: string;
  description: TRichText;
  grid: TConsultingBlok<TQconsultingItemProps | TQconsultingBtnProps>[];
};

export const Qconsulting: FC<TQconsultingProps> = ({
  title,
  description,
  grid,
}) => {
  return (
    <section className="text-white bg-[#452393]">
      <div className="relative py-24 px-[2.4rem] mx-auto max-w-[144rem] sm:text-center md:py-48 md:px-16 xl:px-48 xl:pt-[6.8rem] xl:pb-40">
        <div className="hidden absolute top-[6%] left-[6%] lg:block xl:top-[15%] xl:left-[2%]">
          <Image
            src="/qconsulting/qconsulting-header-icon.svg"
            alt="header icon"
            width={166}
            height={125}
          />
        </div>
        <div className="hidden absolute top-[85%] right-[5%] lg:block xl:top-[77%] xl:right-[2%]">
          <Image
            src="/qconsulting/qconsulting-btn-icon.svg"
            alt="button icon"
            width={371}
            height={225}
          />
        </div>
        <h2 className="text-[4rem] font-extrabold tracking-[0.02em] leading-[5rem] sm:text-[4.8rem] font-heading">
          {title}
        </h2>
        <div
          className="flex flex-col gap-8 mt-[2.8rem] mr-[5.5rem] mb-[4.3rem] text-[1.8rem] leading-[2.2rem] sm:gap-12 sm:mt-28 sm:mr-0 sm:mb-[6rem] lg:mx-36  xl:mt-[3.6rem]"
          dangerouslySetInnerHTML={createMarkup(description)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-[0.5px] sm:bg-white xl:gap-[1px]">
          {grid.map((blok) => (
            <BlokProvider blok={blok} key={blok._uid} />
          ))}
        </div>
      </div>
    </section>
  );
};
