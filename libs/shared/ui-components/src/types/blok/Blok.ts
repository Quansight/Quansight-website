enum ComponentType {}

type TBlokComponentProps = {};

export type TBlok<P, T = TBlokComponentProps> = {
  component: keyof typeof ComponentType | P;
  _uid: string;
  _editable: string;
} & T;
