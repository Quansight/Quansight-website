import { FC } from 'react';

import clsx from 'clsx';

import { createMarkup } from '@quansight/shared/utils';

import BoardButton from './BoardButton';
import BoardItem from './BoardItem';
import { HeaderDecoration, ButtonDecoration } from './decorations';
import { TBoardProps } from './types';

export const Board: FC<TBoardProps> = ({
  title,
  description,
  grid,
  button,
}) => {
  return (
    <section className="text-black bg-transparent">
      <div className="relative py-24 px-[2.4rem] mx-auto sm:text-center md:py-48 md:px-16 xl:px-48 xl:pt-[6.8rem] xl:pb-40 max-w-layout">
        <HeaderDecoration />
        <ButtonDecoration />
        <h2 className="text-[4rem] font-extrabold tracking-[0.02em] leading-[5rem] sm:text-[4.8rem] text-violet font-heading">
          {title}
        </h2>
        <div
          className="flex flex-col gap-8 mt-[2.8rem] mr-[5.5rem] mb-[4.3rem] text-[1.8rem] leading-[2.2rem] sm:gap-12 sm:mt-28 sm:mr-0 sm:mb-[6rem] lg:mx-36  xl:mt-[3.6rem]"
          dangerouslySetInnerHTML={createMarkup(description)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-[0.5px] sm:bg-white xl:gap-[1px]">
          {grid.concat(null).map((props, index) => {
            const numberOfColumns = 3;
            const isRightColumn = (index + 1) % numberOfColumns === 0;
            const numberOfRows = Math.ceil(grid.length / numberOfColumns);
            const firstIndexLastRow = (numberOfRows - 1) * numberOfColumns;
            const isLastRow = index >= firstIndexLastRow;
            const classNameBorder = clsx(
              'border-b-[0.5px] last:border-b-0 sm:border-r-[0.5px] xl:border-r-[1px] xl:border-b-[1px] sm-flex border-violet',
              isRightColumn && 'sm:border-r-0 xl:border-r-0',
              isLastRow && 'sm:border-b-0 xl:border-b-0',
            );
            return props !== null ? (
              <BoardItem
                {...props}
                key={props._uid}
                classNameBorder={classNameBorder}
              />
            ) : (
              <BoardButton
                {...button}
                key="last"
                classNameBorder={classNameBorder}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
