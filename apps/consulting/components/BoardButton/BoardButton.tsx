import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type TBoardButtonProps = {
  buttonTitle: string;
  buttonUrl: string;
};

const BoardButton: FC<TBoardButtonProps> = ({ buttonTitle, buttonUrl }) => {
  return (
    <div className="z-10 mx-auto mt-[6.5rem] sm:flex sm:justify-center sm:items-center sm:mx-0 sm:mt-0 sm:bg-green">
      <div className="border-2 sm:border-none sm:bg-violet">
        <Link href={buttonUrl}>
          <a className="flex gap-3 justify-center items-center py-4 px-10 text-[1.6rem] font-bold leading-[3.7rem]">
            {buttonTitle}
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
