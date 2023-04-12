import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TPostAuthor } from '../../../types/storyblok/bloks/blogPost';

export const BlogHeaderAuthor: FC<TPostAuthor> = ({
  avatarSrc,
  fullName,
  nickName,
  authorUrl,
}) => (
  <section className="flex items-center justify-start gap-[1.4rem]">
    <div className="relative h-[4.8rem] w-[4.8rem] overflow-hidden rounded-full">
      <Picture
        imageSrc={avatarSrc}
        imageAlt={fullName}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
    </div>
    <div className="flex flex-col items-start justify-between">
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
