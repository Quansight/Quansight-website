import type { FC } from 'react';

import clsx from 'clsx';
import { colorToken } from '../utils/colorTokens';

type ButtonColor = 'violet' | 'white' | 'pink';

type ButtonLinkProps = {
  url: string;
  text: string;
  color?: ButtonColor;
  isFull?: boolean;
  isBordered?: boolean;
  isTriangle?: boolean;
  // Real per-widget colors (see extract_button_style) -- Elementor's
  // "-link" class name is on every button widget regardless of its actual
  // skin, so isFull/isBordered/the fill itself all come from the widget's
  // own CSS now, not a fixed violet/white pairing. These win over the
  // `color`-driven classes below when present.
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
};

export const ButtonLink: FC<ButtonLinkProps> = ({
  url,
  text,
  color = 'violet',
  isFull,
  isBordered,
  isTriangle,
  backgroundColor,
  borderColor,
  textColor,
}) => {
  // Real extracted hexes merge onto the site's actual small palette
  // (colorToken) so this renders shared `bg-violet`/`border-white`-style
  // classes instead of a one-off inline hex whenever possible; a genuine
  // outlier color still falls back to inline style rather than forcing a
  // wrong match.
  const bgToken = colorToken(backgroundColor);
  const borderToken = colorToken(borderColor);
  const textToken = colorToken(textColor);
  return (
    <a
      href={url}
      className={clsx(
        'flex justify-start items-center py-4 px-12 w-fit text-[1.6rem] font-bold leading-[3.7rem]',
        !textColor && color === 'pink' && 'text-pink',
        !textColor && color === 'violet' && 'text-violet',
        !textColor && color === 'white' && 'text-white',
        textToken && `text-${textToken}`,
        isFull && !backgroundColor && 'bg-violet',
        isFull && bgToken && `bg-${bgToken}`,
        isBordered &&
          !borderColor &&
          `border-2 border-solid ${
            color === 'violet' ? 'border-violet' : 'border-white'
          }`,
        isBordered && borderColor && 'border-2 border-solid',
        isBordered && borderToken && `border-${borderToken}`,
      )}
      style={{
        backgroundColor: bgToken ? undefined : backgroundColor,
        borderColor: borderToken ? undefined : borderColor,
        color: textToken ? undefined : textColor,
      }}
    >
      {text}
      {isTriangle && (
        <span
          className={clsx(
            'inline-block ml-4 w-0 h-0 border-y-8 border-l-8 border-y-transparent border-y-solid border-l-solid',
            !textColor && color === 'pink' && 'border-l-pink',
            !textColor && color === 'violet' && 'border-l-violet',
            !textColor && color === 'white' && 'border-l-white',
            textToken && `border-l-${textToken}`,
          )}
          style={{ borderLeftColor: textToken ? undefined : textColor }}
        />
      )}
    </a>
  );
};
