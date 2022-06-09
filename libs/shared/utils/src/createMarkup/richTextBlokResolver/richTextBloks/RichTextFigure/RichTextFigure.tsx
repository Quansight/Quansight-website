import { FC } from 'react';

import { TRichTextFigureProps } from './types';

export const RichTextFigure: FC<TRichTextFigureProps> = ({
  imageSrc,
  imageAlt,
  caption,
}) => (
  <figure className="flex flex-col justify-center items-center">
    <img src={imageSrc} alt={imageAlt} />
    <figcaption className="text-[1.5rem] italic font-normal leading-[2.7rem] text-center">
      {caption}
    </figcaption>
  </figure>
);
