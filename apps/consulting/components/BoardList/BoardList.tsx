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
        flex flex-col items-center px-[3rem] mx-auto mt-[2.5rem] md:px-[13rem] lg:flex-wrap
        lg:items-start
        lg:mt-[5rem] lg:h-[90rem] 2xl:pr-0
        2xl:pl-[14rem] 2xl:h-[75rem] max-w-layout
      "
    >
      {grid.map((props) => (
        <BoardListItem {...props} key={props._uid} />
      ))}
      <div className="w-[29rem] lg:mt-[6rem] lg:ml-[12rem]">
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
