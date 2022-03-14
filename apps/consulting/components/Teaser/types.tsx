import { TImageProps } from '../Picture/types';
import { TLinkProps } from '../ButtonLink/types';

export type TTeaserProps = {
  color: string;
  image: TImageProps;
  title: string;
  text: string;
  btn?: string;
  link?: TLinkProps;
}
