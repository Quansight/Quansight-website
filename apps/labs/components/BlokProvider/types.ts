import { TypeValuesUnion } from '@quansight/shared/types';

import { TLogosProps } from '../Logos/Logos';

export enum ComponentType {
  Logos = 'logos',
}

type TBlokComponentPropsMap = {
  [ComponentType.Logos]: TLogosProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
