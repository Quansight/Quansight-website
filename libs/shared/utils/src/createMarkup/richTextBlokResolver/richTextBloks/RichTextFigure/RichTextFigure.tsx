import { FC } from 'react';

import { TRichTextFigureProps } from './types';

export const RichTextFigure: FC<TRichTextFigureProps> = ({
  imageSrc,
  imageAlt,
  caption,
}) => (
  <figure className="flex flex-col items-center justify-center">
    <img src={imageSrc} alt={imageAlt} />
    <figcaption className="text-center text-[1.5rem] font-normal italic leading-[2.7rem]">
      {caption}
    </figcaption>
  </figure>
);
