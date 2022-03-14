import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export type TQconsultingItemProps = {
  title: string;
  image: {
    filename: string;
    alt: string;
  };
  link_title: string;
  link: {
    cached_url: string;
  };
};

export const QconsultingItem: FC<TQconsultingItemProps> = ({
  title,
  image: { filename, alt },
  link_title,
  link: { cached_url },
}) => {
  return (
    <div className="flex flex-col gap-[2.8rem] pt-[2.8rem] pb-[4.1rem] text-center border-t-[0.5px] first:border-t-0 border-t-white lg:gap-0 lg:pt-[4.2rem] lg:bg-[#452393] lg:border-t-0">
      <div className="relative h-32">
        <Image src={filename} alt={alt} layout="fill" priority />
      </div>
      <h3 className="text-[2.2rem] font-extrabold leading-[3rem] lg:mt-[2.8rem] lg:mb-[2.2rem] xl:mt-[3.6rem] xl:mb-[2.2rem] font-heading">
        {title}
      </h3>
      <div className="flex">
        <Link href={`/${cached_url}`}>
          <a className="flex gap-3 justify-center items-center mx-auto w-auto text-[1.6rem] font-bold leading-[3.7rem]">
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
