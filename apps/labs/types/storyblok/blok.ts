import { TBlokComponentProps } from '../../constants/blokMap';

export enum ComponentType {
  Teaser = 'teaser',
  Feature = 'feature',
  Grid = 'grid',
}

export type TBlok<T = TBlokComponentProps> = {
  component: ComponentType;
  _uid: string;
  _editable: string;
} & T;
