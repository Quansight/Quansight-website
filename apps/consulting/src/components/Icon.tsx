import type { FC } from 'react';
import { colorToken } from '../utils/colorTokens';

type IconProps = {
  svg: string;
  size?: number;
  color?: string;
};

// WP source icons are inline <svg> markup (not an icon font), so this
// renders the raw markup directly rather than looking up a named icon.
// The source SVGs have no fill of their own, so without `color` they draw
// SVG's default black; Elementor colors them via an inherited CSS `fill`
// on the wrapper (see extract_icon_box_color in
// convert-pages-consulting.py), which this reproduces the same way.
export const Icon: FC<IconProps> = ({ svg, size = 32, color }) => {
  const token = colorToken(color);
  return (
    <span
      className={token ? `fill-${token} text-${token}` : undefined}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        ...(token ? {} : { fill: color, color }),
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
