import { FC } from 'react';
import Image from 'next/image';

type TBoardDecorationsProps = {
  decoration: string;
};

const BoardDecorations: FC<TBoardDecorationsProps> = ({ decoration }) => {
  if (decoration === 'header')
    return (
      <div className="hidden absolute top-[6%] left-[6%] w-[16.6rem] h-[12.5rem] lg:block xl:top-[15%] xl:left-[2%]">
        <Image
          src="/board/board-header-icon.svg"
          alt="header icon"
          layout="fill"
        />
      </div>
    );
  if (decoration === 'button')
    return (
      <div className="hidden absolute top-[85%] right-[5%] w-[37.1rem] h-[22.5rem] lg:block xl:top-[77%] xl:right-[2%]">
        <Image
          src="/board/board-btn-icon.svg"
          alt="button icon"
          layout="fill"
        />
      </div>
    );
  return <div>BoardDecorations</div>;
};

export default BoardDecorations;
