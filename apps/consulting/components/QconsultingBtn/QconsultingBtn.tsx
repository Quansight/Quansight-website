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
    <div className="flex gap-3 justify-center items-center py-4 px-10 mx-auto mt-[6.5rem] border-2">
      <Link href={`/${cached_url}`}>
        <a className="text-[1.6rem] font-bold leading-[3.7rem]">{link_title}</a>
      </Link>
      <Image
        src="/qconsulting/qconsultin-btn-arrow.svg"
        alt="arrow icon"
        width={12}
        height={17}
        priority
      />
    </div>
  );
};
