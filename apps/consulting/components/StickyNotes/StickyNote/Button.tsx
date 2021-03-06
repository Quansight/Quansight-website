import { FC } from 'react';

import { ButtonLink, ButtonColor } from '@quansight/shared/ui-components';

type TButtonProps = {
  link: string;
  text: string;
};

export const Button: FC<TButtonProps> = ({ link, text }) => (
  <div className="mt-[1.4rem] sm:mt-[3.8rem]">
    <ButtonLink
      isFull
      isTriangle
      url={link}
      text={text}
      color={ButtonColor.White}
    />
  </div>
);
