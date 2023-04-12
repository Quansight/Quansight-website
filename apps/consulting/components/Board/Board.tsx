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
    <section className="bg-transparent text-black">
      <div className="max-w-layout relative mx-auto px-[2.4rem] py-24 sm:text-center md:px-16 md:py-48 xl:px-48 xl:pb-40 xl:pt-[6.8rem]">
        <HeaderDecoration />
        <ButtonDecoration />
        <h2 className="text-violet font-heading text-[4rem] font-extrabold leading-[5rem] tracking-[0.02em] sm:text-[4.8rem]">
          {title}
        </h2>
        <div
          className="mb-[4.3rem] mr-[5.5rem] mt-[2.8rem] flex flex-col gap-8 text-[1.8rem] leading-[2.2rem] sm:mb-[6rem] sm:mr-0 sm:mt-28 sm:gap-12 lg:mx-36  xl:mt-[3.6rem]"
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
              'sm-flex border-violet border-b-[0.5px] last:border-b-0 sm:border-r-[0.5px] xl:border-b-[1px] xl:border-r-[1px]',
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
