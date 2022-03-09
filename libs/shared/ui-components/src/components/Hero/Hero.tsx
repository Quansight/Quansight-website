import React, { FC } from 'react';

export enum HeroVariant {
  Home = 'home',
  Page = 'page',
}

export type THeroProps = {
  variant: HeroVariant;
};

export const Hero: FC = () => {};
