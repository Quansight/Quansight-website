import { HeroVariant } from '../types';
import heroHomeImageSrc from '../assets/astronauts_green.png';
import heroPageImageSrc from '../assets/global_warming_europe_plum.png';

export const getHeroBackground = (variant: HeroVariant): StaticImageData =>
  ({
    [HeroVariant.Small]: heroPageImageSrc,
    [HeroVariant.Large]: heroHomeImageSrc,
    [HeroVariant.Medium]: heroPageImageSrc,
  }[variant]);
