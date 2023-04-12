import { FC } from 'react';

import { ButtonLink, ButtonColor } from '@quansight/shared/ui-components';

import { TColumnLinkProps } from './types';

export const ColumnLink: FC<TColumnLinkProps> = ({ linkText, linkUrl }) => {
  if (linkText && linkUrl) {
    return (
      <div className="ml-[-3rem] mt-[1rem] lg:mt-[4rem]">
        <ButtonLink
          url={linkUrl}
          text={linkText}
          color={ButtonColor.Violet}
          isTriangle
        />
      </div>
    );
  } else {
    return null;
  }
};
