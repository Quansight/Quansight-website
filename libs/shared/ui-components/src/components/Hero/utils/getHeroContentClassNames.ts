import { HeroVariant } from '../types';

export const getHeroContentClassNames = (variant: HeroVariant): string[] => {
  const isLargeHero = variant === HeroVariant.Large;
  const isMediumHero = variant === HeroVariant.Medium;

  return [
    'absolute',
    ...(isLargeHero ? ['w-1/2', 'top-52', 'left-48'] : []),
    ...(isMediumHero
      ? [
          'h-full',
          'w-full',
          'flex',
          'items-center',
          'justify-center',
          'flex-col',
        ]
      : []),
  ];
};
