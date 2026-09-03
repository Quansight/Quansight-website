import type { FC } from 'react';
import { Icon } from './Icon';

type IconBoxProps = {
  title?: string;
  description?: string;
  icon?: string;
  divider?: boolean;
};

export const IconBox: FC<IconBoxProps> = ({
  title,
  description,
  icon,
  divider,
}) => (
  <div
    className={`p-[2rem] ${
      divider ? 'border-b border-solid border-violet' : ''
    }`}
  >
    {icon && (
      <div className="mb-[1.6rem]">
        <Icon svg={icon} size={38} />
      </div>
    )}
    {title && (
      <h3 className="mb-[1rem] text-[1.9rem] font-bold leading-[2.7rem] font-heading text-violet">
        {title}
      </h3>
    )}
    {description && (
      <p className="text-[1.4rem] leading-[2.4rem] text-black">{description}</p>
    )}
  </div>
);
