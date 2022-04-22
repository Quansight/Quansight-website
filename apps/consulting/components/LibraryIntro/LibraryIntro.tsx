import { FC } from 'react';
import { TLibraryIntroProps } from './types';

export const LibraryIntro: FC<TLibraryIntroProps> = ({
  title,
  description,
}) => (
  <section>
    <h2>{title}</h2>
    <p>{description}</p>
  </section>
);

export default LibraryIntro;
