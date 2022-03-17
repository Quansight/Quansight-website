import { TTeaserProps, getUrl } from '@quansight/shared/ui-components';
import { TTeaserRawData } from '../../../types/storyblok/bloks/teaser';

export const getTeaserProps = (blok: TTeaserRawData): TTeaserProps => ({
  color: blok.color,
  title: blok.title,
  text: blok.text,
  imageSrc: blok.image.filename,
  imageAlt: blok.image.alt,
  buttonText: blok.buttonText,
  buttonLink: getUrl(blok.link),
});
