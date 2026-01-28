import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TPostAuthor } from '../../../types/storyblok/bloks/blogPost';

export const BlogHeaderAuthor: FC<TPostAuthor> = ({
  avatarSrc,
  fullName,
  nickName,
  authorUrl,
}) => (
  <section className="flex gap-[1.4rem] justify-start items-center">
    <div className="overflow-hidden relative w-[4.8rem] h-[4.8rem] rounded-full">
      <Picture
        imageSrc={avatarSrc}
        imageAlt={fullName}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
    </div>
    <div className="flex flex-col justify-between items-start">
      <a
        href={authorUrl.url}
        target="_blank"
        rel="noreferrer"
        className="text-[1.4rem] font-normal leading-[2.7rem]"
      >
        {nickName}
      </a>
      <p className="text-[1.9rem] font-extrabold leading-[2.7rem]">
        {fullName}
      </p>
    </div>
  </section>
);
