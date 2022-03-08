import React, { FC } from 'react';

export type TTeaserProps = {
  headline: string;
};

export const Teaser: FC<TTeaserProps> = ({ headline }) => {
  return <h1>{headline}</h1>;
};
