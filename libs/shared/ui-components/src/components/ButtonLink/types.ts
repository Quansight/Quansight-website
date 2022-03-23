export enum ButtonColor {
  Violet = 'violet',
  White = 'white',
}

export type TButtonLinkProps = {
  isFull?: boolean;
  isBordered?: boolean;
  isTriangle?: boolean;
  color: ButtonColor;
  text: string;
  url: string;
};
