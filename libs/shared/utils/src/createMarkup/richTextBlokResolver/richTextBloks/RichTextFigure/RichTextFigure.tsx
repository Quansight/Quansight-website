import { FC } from 'react';

import { TRichTextFigureProps } from './types';

export const RichTextFigure: FC<TRichTextFigureProps> = ({
  imageSrc,
  imageAlt,
  caption,
}) => (
  <figure>
    <img src={imageSrc} alt={imageAlt} />
    <figcaption>{caption}</figcaption>
  </figure>
);
