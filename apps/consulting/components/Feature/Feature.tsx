import React, { FC } from 'react';

export type TFeatureProps = {
  name: string;
};

export const Feature: FC<TFeatureProps> = ({ name }) => {
  return <h2>{name}</h2>;
};
