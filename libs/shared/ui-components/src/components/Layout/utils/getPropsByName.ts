import { TBlok } from '@quansight/shared/types';

export const getPropsByName = (
  data: TBlok[],
  slug: string,
): TBlok | undefined => data.find((item: TBlok) => item.component === slug);
