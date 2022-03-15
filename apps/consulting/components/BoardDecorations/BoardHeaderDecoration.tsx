import { FC } from 'react';
import Image from 'next/image';

export const BoardHeaderDecoration: FC = () => (
  <div className="hidden absolute top-[6%] left-[6%] w-[16.6rem] h-[12.5rem] lg:block xl:top-[15%] xl:left-[2%]">
    <Image
      src="/board/board-header-icon.svg"
      alt="header icon"
      layout="responsive"
      width={166}
      height={125}
      priority
    />
  </div>
);
