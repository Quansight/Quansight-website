import { FC } from 'react';

import Link from 'next/link';

import { Picture } from '@quansight/shared/ui-components';

import HeaderLinkIcon from './assets/headerLinkIcon.svg';

export const BlogHeaderLink: FC = () => (
  <Link href="/library">
    <a className="justify-left mb-[1.2rem] flex items-center gap-[1rem] sm:mt-[1.8rem]">
      <div aria-hidden="true" className="relative h-[1rem] w-[1rem] text-black">
        <Picture
          imageSrc={HeaderLinkIcon}
          imageAlt="Decorative"
          layout="fill"
        />
      </div>
      <span className="text-[1.4rem] font-normal leading-[2.7rem] text-black">
        Back to library
      </span>
    </a>
  </Link>
);
