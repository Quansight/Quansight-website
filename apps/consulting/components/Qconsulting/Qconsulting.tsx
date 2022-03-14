import { FC } from 'react';
import { BlokProvider } from '../BlokProvider/BlokProvider';
import { TQconsultingItemProps } from '../QconsultingItem/QconsultingItem';
import { TConsultingBlok } from '../BlokProvider/types';

export type TQconsultingProps = {
  title: string;
  description: string;
  grid: TConsultingBlok<TQconsultingItemProps>[];
};

export const Qconsulting: FC<TQconsultingProps> = ({
  title,
  description,
  grid,
}) => {
  return (
    <section className="text-white bg-[#452393]">
      <h2>{title}</h2>
      <p>{description}</p>
      <div>
        {grid.map((blok) => (
          <BlokProvider blok={blok} key={blok._uid} />
        ))}
      </div>
    </section>
  );
};
