import { TBlok } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';

export type TPageHeadingRawData = {
  component: ComponentType.PageHeading;
  title: string;
  description: string;
} & TBlok;
