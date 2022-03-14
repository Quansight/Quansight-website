import { FC } from 'react';
import Image from 'next/image';

export type TStoryblokImageProps = {
  id: number,
  alt: string,
  name?: string,
  title?: string,
  filename: string,
  copyright?: string,
}

export type TPictureProps = {
  storyblokImg: TStoryblokImageProps,
  width: number,
  height: number
};

export const Picture: FC<TPictureProps> = ({ storyblokImg, ...props }) => (
  <Image src={storyblokImg.filename} alt={storyblokImg.alt} {...props} />
);
