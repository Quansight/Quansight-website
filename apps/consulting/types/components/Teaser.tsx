import { TImageProps } from './Picture';
import { TLinkProps } from './ButtonLink';

export type TTeaserProps = {
  color: string,
  image: TImageProps,
  title: string,
  text: string,
  btn?: string,
  link?: TLinkProps
}
