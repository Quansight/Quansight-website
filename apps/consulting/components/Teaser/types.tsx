import { TImageProps } from '../../types/storyblok/imageProps';
import { TLinkProps } from '../../types/storyblok/linkProps';

export type TTeaserProps = {
  color: string;
  image: TImageProps;
  title: string;
  text: string;
  buttonText?: string;
  link?: TLinkProps;
};
