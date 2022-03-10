import { TBlok } from '../../types/storyblok/blok';
import { TButtonLinkProps } from '../../components/ButtonLink/ButtonLink';

export const getFeatureProps = (
  blok: TBlok<TButtonLinkProps>,
): TButtonLinkProps => ({
  color: blok.color,
  background: blok.background,
  border: blok.border,
  triangle: blok.triangle,
  text: blok.text,
  link: blok.link,
});
