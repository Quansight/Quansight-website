import type { FC } from 'react';
import { Picture } from './Picture';

type ImageBoxProps = {
  image: string;
  imageAlt: string;
  description?: string;
  layout?: 'column' | 'row' | 'row-reverse';
};

const LAYOUT_CLASS = {
  column: 'flex-col items-center text-center',
  row: 'flex-row items-center text-left',
  'row-reverse': 'flex-row-reverse items-center text-right',
};

export const ImageBox: FC<ImageBoxProps> = ({
  image,
  imageAlt,
  description,
  layout = 'column',
}) => (
  <div className={`flex gap-[1.6rem] p-[2rem] ${LAYOUT_CLASS[layout]}`}>
    <div className="shrink-0 w-[4rem] h-[4rem]">
      <Picture
        src={image}
        alt={imageAlt}
        width={40}
        height={40}
        objectFit="contain"
      />
    </div>
    {description && (
      <p className="text-[1.5rem] leading-[2.4rem] text-black">{description}</p>
    )}
  </div>
);
