import { FC } from 'react';
import { BlokProvider } from '../BlokProvider/BlokProvider';
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
    <section className="py-16 px-5 text-white bg-[#452393]">
      <h2 className="text-[4rem] font-extrabold tracking-[0.02em] leading-[5rem] font-heading">
        {title}
      </h2>
      <div className="flex flex-col gap-8 mt-7 mr-[5.5rem] mb-[4.3rem]">
        {description.map((blok) => (
          <BlokProvider blok={blok} key={blok._uid} />
        ))}
      </div>
      <div className="grid grid-cols-1">
        {grid.map((blok) => (
          <BlokProvider blok={blok} key={blok._uid} />
        ))}
      </div>
    </section>
  );
};
