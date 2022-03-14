import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type TQconsultingBtnProps = {
  link_title: string;
  link: {
    cached_url: string;
  };
};

export const QconsultingBtn: FC<TQconsultingBtnProps> = ({
  link_title,
  link: { cached_url },
}) => {
  return (
    <div className="z-10 mx-auto mt-[6.5rem] lg:flex lg:justify-center lg:items-center lg:mx-0 lg:mt-0 lg:bg-[#99C941]">
      <div className="border-2 lg:bg-[#452393] lg:border-none">
        <Link href={`/${cached_url}`}>
          <a className="flex gap-3 justify-center items-center py-4 px-10 text-[1.6rem] font-bold leading-[3.7rem] ">
            {link_title}
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
