import { FC } from 'react';
import Image from 'next/image';

export const BoardButtonDecoration: FC = () => (
  <div className="hidden absolute top-[85%] right-[5%] w-[37.1rem] h-[22.5rem] lg:block xl:top-[77%] xl:right-[2%]">
    <Image
      src="/board/board-btn-icon.svg"
      alt="button icon"
      layout="responsive"
      width={371}
      height={225}
      priority
    />
  </div>
);
