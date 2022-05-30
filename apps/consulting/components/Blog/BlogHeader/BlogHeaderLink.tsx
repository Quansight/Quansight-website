import { FC } from 'react';

import { useRouter } from 'next/router';

import { Picture } from '@quansight/shared/ui-components';

import HeaderLinkIcon from '../assets/headerLinkIcon.svg';

export const BlogHeaderLink: FC = () => {
  const router = useRouter();

  return (
    <button
      className="flex gap-[1rem] justify-center items-center mb-[1.2rem]"
      type="button"
      onClick={() => router.back()}
    >
      <div aria-hidden="true" className="relative w-[1rem] h-[1rem] text-black">
        <Picture
          imageSrc={HeaderLinkIcon}
          imageAlt="Decorative"
          layout="fill"
        />
      </div>
      <span className="text-[1.4rem] font-normal leading-[2.7rem] text-black">
        Back to blog
      </span>
    </button>
  );
};
