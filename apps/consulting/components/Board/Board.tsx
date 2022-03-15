import { FC } from 'react';
import BoardDecorations from '../BoardDecorations/BoardDecorations';
import { TRichText } from '../../types/storyblok/richTextTypes';
import { createMarkup } from '../../services/createMarkup/createMarkup';
import BoardItem, { TBoardItemProps } from '../BoardItem/BoardItem';
// import BoardButton from '../BoardButton/BoardButton';

export type TBoardProps = {
  title: string;
  description: TRichText;
  grid: TBoardItemProps[];
};

export const Board: FC<TBoardProps> = ({ title, description, grid }) => {
  return (
    <section className="text-white bg-[#452393]">
      <div className="relative py-24 px-[2.4rem] mx-auto max-w-[144rem] sm:text-center md:py-48 md:px-16 xl:px-48 xl:pt-[6.8rem] xl:pb-40">
        <BoardDecorations decoration="header" />
        <BoardDecorations decoration="button" />
        <h2 className="text-[4rem] font-extrabold tracking-[0.02em] leading-[5rem] sm:text-[4.8rem] font-heading">
          {title}
        </h2>
        <div
          className="flex flex-col gap-8 mt-[2.8rem] mr-[5.5rem] mb-[4.3rem] text-[1.8rem] leading-[2.2rem] sm:gap-12 sm:mt-28 sm:mr-0 sm:mb-[6rem] lg:mx-36  xl:mt-[3.6rem]"
          dangerouslySetInnerHTML={createMarkup(description)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-[0.5px] sm:bg-white xl:gap-[1px]">
          {grid.map((props) => (
            <BoardItem {...props} key={props._uid} />
          ))}
        </div>
      </div>
    </section>
  );
};
