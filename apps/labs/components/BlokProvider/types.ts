import { TypeValuesUnion } from '@quansight/shared/config';

import { TLogosProps } from '../Logos/Logos';

export enum ComponentType {
  Logos = 'logos',
}

type TBlokComponentPropsMap = {
  [ComponentType.Logos]: TLogosProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
