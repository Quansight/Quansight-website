import { TBlok } from '@quansight/shared/types';
import { TVideoProps } from '@quansight/shared/ui-components';

import { ComponentType } from '../../../components/BlokProvider/types';

export type TVideoRawData = {
  component: ComponentType.Video;
} & TBlok &
  TVideoProps;
