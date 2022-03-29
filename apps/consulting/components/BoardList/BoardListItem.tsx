import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';
import { ButtonColor, ButtonLink } from '@quansight/shared/ui-components';

import { TBoardListItemProps } from './types';

const BoardListItem: FC<TBoardListItemProps> = ({
  title,
  text,
  linkTitle,
  linkUrl,
  imageSrc,
  imageAlt,
}) => (
  <div
    className="
    flex flex-col items-center
    lg:flex-row lg:items-start lg:w-1/2 lg:h-[30rem]
    2xl:h-[25rem]
  "
  >
    <div className="lg:w-1/3 lg:min-w-[9rem] lg:text-right">
      <Picture imageSrc={imageSrc} imageAlt={imageAlt} width={90} height={90} />
    </div>
    <div className="mt-[1.5rem] mb-[4.4rem] lg:mt-0">
      <h3
        className="
        text-[2.2rem] font-extrabold leading-[3rem] text-center
        lg:pl-[3rem] lg:mb-[2.5rem] lg:text-left
      "
      >
        {title}
      </h3>
      {text && (
        <p
          className="
          mb-[0.5rem] text-[1.6rem] leading-[2.7rem] text-center 
          lg:px-[3rem] lg:text-left
        "
        >
          {text}
        </p>
      )}
      {linkTitle && linkUrl && (
        <div className="flex justify-center lg:justify-start">
          <ButtonLink
            isTriangle
            text={linkTitle}
            url={linkUrl}
            color={ButtonColor.Pink}
          />
        </div>
      )}
    </div>
  </div>
);

export default BoardListItem;
