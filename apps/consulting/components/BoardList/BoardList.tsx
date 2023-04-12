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
    <section className="max-w-layout mx-auto mt-[2.5rem] grid grid-cols-1 gap-x-[2rem] px-[3rem] md:px-[13rem] lg:mt-[5rem] lg:grid-cols-2">
      {grid.map((props) => (
        <BoardListItem {...props} key={props._uid} />
      ))}
      <div className="flex items-center justify-center lg:mt-[6rem] lg:ml-[12rem] lg:w-[29rem] lg:items-start lg:justify-start">
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
