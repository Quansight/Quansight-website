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
        'flex flex-col pb-[4.1rem] pt-[2.8rem] text-center sm:pt-[4.2rem]',
        classNameBorder,
      )}
    >
      <Link href={linkUrl}>
        <a>
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
          <div className="font-heading text-[2.2rem] font-extrabold leading-[3rem] sm:mb-[2.2rem] sm:mt-[2.8rem] xl:mb-[2.2rem] xl:mt-[3.6rem]">
            {title}
          </div>
          <div className="mx-auto flex w-auto items-center justify-center gap-3 text-[1.6rem] font-bold leading-[3.7rem]">
            {linkTitle}
            <Picture
              imageSrc="/board/board-btn-arrow.svg"
              imageAlt=""
              width={12}
              height={17}
              priority
            />
          </div>
        </a>
      </Link>
    </div>
  );
};

export default BoardItem;
