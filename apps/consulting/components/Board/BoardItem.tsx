import { FC } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { Picture } from '@quansight/shared/ui-components';

import { TBoardItemProps } from './types';

const BoardItem: FC<TBoardItemProps & { classNameBorder: string }> = ({
  title,
  linkTitle,
  linkUrl,
  imageSrc,
  classNameBorder,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col pt-[2.8rem] pb-[4.1rem] text-center sm:pt-[4.2rem]',
        classNameBorder,
      )}
    >
      <Link href={linkUrl}>

        <div className="relative h-32">
          <Picture
            imageSrc={imageSrc}
            // Alt text deliberately empty because the images used here are decorative.
            imageAlt=""
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
        <div className="text-[2.2rem] font-extrabold leading-[3rem] sm:mt-[2.8rem] sm:mb-[2.2rem] xl:mt-[3.6rem] xl:mb-[2.2rem] font-heading">
          {title}
        </div>
        <div className="flex gap-3 justify-center items-center mx-auto w-auto text-[1.6rem] font-bold leading-[3.7rem]">
          {linkTitle}
          <Picture
            imageSrc="/board/board-btn-arrow.svg"
            imageAlt=""
            width={12}
            height={17}
            priority
          />
        </div>

      </Link>
    </div>
  );
};

export default BoardItem;
