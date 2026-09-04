import type { FC } from 'react';
import { Icon } from './Icon';
import { colorToken } from '../utils/colorTokens';
import { sizeToken } from '../utils/fontSizeTokens';

type IconBoxProps = {
  title?: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  descriptionSizePx?: number;
  descriptionColor?: string;
  divider?: boolean;
  // Elementor's own default for this widget is centered (confirmed via
  // its base CSS, .elementor-icon-box-wrapper{text-align:center}) --
  // 'start' is the real, per-widget exception (e.g. the "AI Environment
  // Management" divided-list style), not the default.
  align?: 'center' | 'start';
};

export const IconBox: FC<IconBoxProps> = ({
  title,
  description,
  icon,
  iconColor,
  descriptionSizePx,
  descriptionColor,
  divider,
  align = 'center',
}) => (
  <div
    className={`flex flex-col p-[2rem] ${
      align === 'center' ? 'items-center text-center' : 'items-start text-left'
    } ${divider ? 'border-b border-solid border-violet' : ''}`}
  >
    {icon && (
      <div className="mb-[1.6rem]">
        <Icon svg={icon} size={38} color={iconColor} />
      </div>
    )}
    {title && (
      <h3 className="mb-[1rem] text-[1.9rem] font-bold leading-[2.7rem] font-heading text-violet">
        {title}
      </h3>
    )}
    {description &&
      (() => {
        const colorTok = colorToken(descriptionColor);
        // WP's real description size varies per widget (16-21px sitewide)
        // -- "xs" (the sitewide paragraph-text size) is only the fallback
        // for when that wasn't extracted, not a small caption-text default.
        const sizeTok = sizeToken(descriptionSizePx) ?? 'xs';
        return (
          <p
            className={`leading-[1.5] text-${sizeTok} ${
              colorTok
                ? `text-${colorTok}`
                : descriptionColor
                ? ''
                : 'text-black'
            }`}
            style={{
              color: colorTok ? undefined : descriptionColor,
            }}
          >
            {description}
          </p>
        );
      })()}
  </div>
);
