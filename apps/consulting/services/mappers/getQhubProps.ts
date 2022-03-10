import { TBlok } from '../../types/storyblok/blok';
import { TQhubProps } from '../../components/Qhub/Qhub';

export const getQhubProps = (blok: TBlok<TQhubProps>): TQhubProps => ({
  name: blok.name,
  color: blok.color,
  image: blok.image,
  title: blok.title,
  text: blok.text,
});
