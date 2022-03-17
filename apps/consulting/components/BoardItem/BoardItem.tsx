import { FC } from 'react';
import Link from 'next/link';
import { Picture } from '@quansight/shared/ui-components';

export type TBoardItemProps = {
  _uid?: string;
  title: string;
  linkTitle: string;
  linkUrl: string;
  imageSrc: string;
  imageAlt: string;
};

const BoardItem: FC<TBoardItemProps> = ({
  title,
  linkTitle,
  linkUrl,
  imageSrc,
  imageAlt,
}) => {
  return (
    <div className="flex flex-col gap-[2.8rem] pt-[2.8rem] pb-[4.1rem] text-center border-t-[0.5px] first:border-t-0 border-t-white sm:gap-0 sm:pt-[4.2rem] sm:border-t-0 sm:bg-violet">
      <div className="relative h-32">
        <Picture
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          layout="fill"
          priority
        />
      </div>
      <h3 className="text-[2.2rem] font-extrabold leading-[3rem] sm:mt-[2.8rem] sm:mb-[2.2rem] xl:mt-[3.6rem] xl:mb-[2.2rem] font-heading">
        {title}
      </h3>
      <div className="flex">
        <Link href={linkUrl}>
          <a className="flex gap-3 justify-center items-center mx-auto w-auto text-[1.6rem] font-bold leading-[3.7rem]">
            {linkTitle}
            <Picture
              imageSrc="/board/board-btn-arrow.svg"
              imageAlt="arrow icon"
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

export default BoardItem;
