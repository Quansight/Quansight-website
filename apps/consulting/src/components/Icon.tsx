import type { FC } from 'react';

type IconProps = {
  svg: string;
  size?: number;
};

// WP source icons are inline <svg> markup (not an icon font), so this
// renders the raw markup directly rather than looking up a named icon.
export const Icon: FC<IconProps> = ({ svg, size = 32 }) => (
  <span
    style={{ display: 'inline-block', width: size, height: size }}
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);
