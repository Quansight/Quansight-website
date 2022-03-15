import { FC } from 'react';
import Image from 'next/image';

type TBoardDecorationsProps = {
  decoration: string;
};

const BoardDecorations: FC<TBoardDecorationsProps> = ({ decoration }) => {
  if (decoration === 'header')
    return (
      <div className="hidden absolute top-[6%] left-[6%] lg:block xl:top-[15%] xl:left-[2%]">
        <Image
          src="/board/board-header-icon.svg"
          alt="header icon"
          width={166}
          height={125}
        />
      </div>
    );
  if (decoration === 'button')
    return (
      <div className="hidden absolute top-[85%] right-[5%] lg:block xl:top-[77%] xl:right-[2%]">
        <Image
          src="/board/board-btn-icon.svg"
          alt="button icon"
          width={371}
          height={225}
        />
      </div>
    );
  return <div>BoardDecorations</div>;
};

export default BoardDecorations;
