import { FC } from 'react';

import { ButtonColor, ButtonLink } from '@quansight/shared/ui-components';
import BoardListItem from './BoardListItem';

import { TBoardListProps } from './types';

export const BoardList: FC<TBoardListProps> = ({
  grid,
  linkTitle,
  linkUrl,
}) => {
  return (
    <section
      className="
        flex flex-col items-center px-[3rem] mx-auto 4k:h-[75rem] 
        md:px-[13rem]
        lg:flex-wrap lg:items-start lg:h-[90rem] max-w-layout
      "
    >
      {grid.map((props) => (
        <BoardListItem {...props} key={props._uid} />
      ))}
      <div className="w-[27rem] lg:mt-[6rem] lg:ml-[12rem]">
        <ButtonLink
          isFull
          isTriangle
          text={linkTitle}
          url={linkUrl}
          color={ButtonColor.White}
        />
      </div>
    </section>
  );
};
