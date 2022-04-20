import { FC } from 'react';

import { ButtonLink, ButtonColor } from '@quansight/shared/ui-components';

import { TColumnLinkProps } from './types';

export const ColumnLink: FC<TColumnLinkProps> = ({ linkText, linkUrl }) => {
  if (linkText && linkUrl) {
    return (
      <div className="mt-[1rem] ml-[-3rem] lg:mt-[4rem]">
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
