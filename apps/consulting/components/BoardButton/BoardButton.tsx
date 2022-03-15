import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type TBoardButtonProps = {
  button_title: string;
  button_url: string;
};

const BoardButton: FC<TBoardButtonProps> = ({ button_title, button_url }) => {
  return (
    <div className="z-10 mx-auto mt-[6.5rem] sm:flex sm:justify-center sm:items-center sm:mx-0 sm:mt-0 sm:bg-[#99C941]">
      <div className="border-2 sm:bg-[#452393] sm:border-none">
        <Link href={`/${button_url}`}>
          <a className="flex gap-3 justify-center items-center py-4 px-10 text-[1.6rem] font-bold leading-[3.7rem]">
            {button_title}
            <Image
              src="/qconsulting/qconsulting-btn-arrow.svg"
              alt="arrow icon"
              width={12}
              height={17}
              priority
            />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BoardButton;
