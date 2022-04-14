import { TFooterProps } from '../../Footer/types';

export const getPropsByName = (
  data: TFooterProps[],
  slug: string,
): TFooterProps | undefined => data.find((item) => item.component === slug);
