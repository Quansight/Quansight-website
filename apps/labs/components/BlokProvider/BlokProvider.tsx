import Placeholder from '../Placeholder/Placeholder';
import { TBlok } from '../../types/storyblok/block';

const Components = {
  Placeholder,
};

export type TBlokProviderProps = {
  blok: TBlok;
};

export const BlokProvider = ({ blok, idx, ...props }) => {
  console.log({
    blok,
    idx,
    props,
  });
  if (blok && typeof Components[blok.component] !== 'undefined') {
    const Component = Components[blok.component];

    return <Component blok={blok} idx={idx} {...props} />;
  }
  return <Placeholder componentName={blok ? blok.component : null} />;
};
