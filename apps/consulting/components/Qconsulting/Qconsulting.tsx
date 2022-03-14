import { FC } from 'react';
import { BlokProvider } from '../BlokProvider/BlokProvider';
import Image from 'next/image';
import { TQconsultingItemProps } from '../QconsultingItem/QconsultingItem';
import { TQconsultingBtnProps } from '../QconsultingBtn/QconsultingBtn';
import { TQconsultingParagraphProps } from '../QconsultingParagraph/QconsultingParagraph';
import { TConsultingBlok } from '../BlokProvider/types';

export type TQconsultingProps = {
  title: string;
  description: TConsultingBlok<TQconsultingParagraphProps>[];
  grid: TConsultingBlok<TQconsultingBtnProps | TQconsultingItemProps>[];
};

export const Qconsulting: FC<TQconsultingProps> = ({
  title,
  description,
  grid,
}) => {
  return (
    <section className="py-16 px-5 text-white bg-[#452393] lg:py-[12rem] lg:px-10">
      <div className="relative mx-auto max-w-[144rem] lg:text-center">
        <div className="hidden absolute top-[-5%] left-0 lg:block">
          <Image
            src="/qconsulting/qconsulting-header-icon.svg"
            alt="header icon"
            width={166}
            height={125}
          />
        </div>
        <h2 className="text-[4rem] font-extrabold tracking-[0.02em] leading-[5rem] lg:text-[4.8rem] font-heading">
          {title}
        </h2>
        <div className="flex flex-col gap-8 mt-7 mr-[5.5rem] mb-[4.3rem] lg:gap-12 lg:mx-[13rem] lg:mt-[7rem] lg:mb-[4.8rem]">
          {description.map((blok) => (
            <BlokProvider blok={blok} key={blok._uid} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-[1px] lg:bg-white">
          {grid.map((blok) => (
            <BlokProvider blok={blok} key={blok._uid} />
          ))}
        </div>
        <div className="hidden absolute top-[95%] right-0 lg:block">
          <Image
            src="/qconsulting/qconsulting-btn-icon.svg"
            alt="button icon"
            width={371}
            height={225}
          />
        </div>
      </div>
    </section>
  );
};
