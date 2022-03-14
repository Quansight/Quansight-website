import { HeroVariant } from '../types';

export const getHeroContainerClassNames = (
  variant: HeroVariant,
): Array<string | Record<string, boolean>> => {
  const isLargeHero = variant === HeroVariant.Large;
  const isMediumHero = variant === HeroVariant.Medium;
  const isSmallHero = variant === HeroVariant.Small;

  return [
    'relative',
    {
      'h-heroLarge': isLargeHero,
      'h-heroMedium': isMediumHero,
      'h-heroSmall': isSmallHero,
    },
  ];
};
