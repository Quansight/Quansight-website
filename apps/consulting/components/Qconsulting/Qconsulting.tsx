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
  grid: TConsultingBlok<TQconsultingItemProps | TQconsultingBtnProps>[];
};

export const Qconsulting: FC<TQconsultingProps> = ({
  title,
  description,
  grid,
}) => {
  return (
    <section className="text-white bg-[#452393]">
      <div className="relative py-24 px-[2.4rem] mx-auto max-w-[144rem] lg:py-48 lg:px-16 lg:text-center xl:px-48 xl:pt-[6.8rem] xl:pb-40">
        {/* <div className="hidden absolute top-[-5%] left-0 lg:block xl:top-[10%] xl:left-[3%]">
          <Image
            src="/qconsulting/qconsulting-header-icon.svg"
            alt="header icon"
            width={166}
            height={125}
          />
        </div>
        <div className="hidden absolute top-[95%] right-0 lg:block xl:top-[85%] xl:right-[-5%]">
          <Image
            src="/qconsulting/qconsulting-btn-icon.svg"
            alt="button icon"
            width={371}
            height={225}
          />
        </div> */}
        <h2 className="text-[4rem] font-extrabold tracking-[0.02em] leading-[5rem] lg:text-[4.8rem] font-heading">
          {title}
        </h2>
        <div className="flex flex-col gap-8 mt-[2.8rem] mr-[5.5rem] mb-[4.3rem] lg:gap-12 lg:mx-36 lg:mt-28 lg:mb-[6rem] xl:mt-[3.6rem] xl:mb-[11.6rem]">
          {description.map((blok) => (
            <BlokProvider blok={blok} key={blok._uid} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-[1px] lg:bg-white">
          {grid.map((blok) => (
            <BlokProvider blok={blok} key={blok._uid} />
          ))}
        </div>
      </div>
    </section>
  );
};
