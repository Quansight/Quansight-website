import type { FC } from 'react';
import { md } from '../utils/markdown';
import { colorToken } from '../utils/colorTokens';

type IconListItem = { text: string; icon?: string } | string;

type IconListProps = {
  items: IconListItem[];
  // The widget's icon fill and size, and text color/size, when its CSS
  // sets them (see convert_icon_list); Elementor's defaults otherwise.
  iconColor?: string;
  iconSizePx?: number;
  textColor?: string;
  textSizePx?: number;
};

// Elementor's icon-list: each item leads with its own inline SVG icon
// (a check mark, a caret...) sized by --e-icon-list-icon-size and
// filled per widget. Items without an icon fall back to a disc bullet.
export const IconList: FC<IconListProps> = ({
  items,
  iconColor,
  iconSizePx = 14,
  textColor,
  textSizePx,
}) => {
  const iconTok = colorToken(iconColor);
  const textTok = colorToken(textColor);
  return (
    <ul className="pl-0 list-none">
      {items.map((item, i) => {
        const { text, icon } =
          typeof item === 'string' ? { text: item, icon: undefined } : item;
        return (
          <li
            key={i}
            className={`mb-[1rem] flex items-start gap-[0.5em] leading-[1.6] ${
              icon ? '' : 'list-disc ml-[2rem] list-item'
            } ${textTok ? `text-${textTok}` : textColor ? '' : 'text-black'}`}
            style={{
              fontSize: textSizePx ? `${textSizePx}px` : '1.5rem',
              color: textTok ? undefined : textColor,
            }}
          >
            {icon && (
              <span
                className={`shrink-0 mt-[0.35em] ${
                  iconTok ? `fill-${iconTok} text-${iconTok}` : ''
                }`}
                style={{
                  width: iconSizePx,
                  height: iconSizePx,
                  ...(iconTok
                    ? {}
                    : {
                        fill: iconColor ?? '#452392',
                        color: iconColor ?? '#452392',
                      }),
                }}
                dangerouslySetInnerHTML={{ __html: icon }}
              />
            )}
            <span dangerouslySetInnerHTML={md(text)} />
          </li>
        );
      })}
    </ul>
  );
};
