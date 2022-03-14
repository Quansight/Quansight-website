import { HeroVariant } from '../types';

export const getHeroTitleClassNames = (
  variant: HeroVariant,
): Array<string | Record<string, boolean>> => {
  const isLargeHero = variant === HeroVariant.Large;
  return [
    'text-white',
    'text-heroTitle',
    'font-primary',
    {
      'mb-12': isLargeHero,
    },
  ];
};
