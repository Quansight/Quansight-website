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
    <section className="grid grid-cols-1 gap-x-[2rem] px-[3rem] mx-auto mt-[2.5rem] md:px-[13rem] lg:grid-cols-2 lg:mt-[5rem] max-w-layout">
      {grid.map((props) => (
        <BoardListItem {...props} key={props._uid} />
      ))}
      <div className="flex justify-center items-center lg:justify-start lg:items-start lg:mt-[6rem] lg:ml-[12rem] lg:w-[29rem]">
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
