import React, { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TPostMeta } from '../../../../types/storyblok/bloks/posts';

export type TPostAuthorProps = TPostMeta['author'];

export const PostAuthor: FC<TPostAuthorProps> = ({
  nickName,
  fullName,
  avatarSrc,
}) => (
  <div className="flex">
    <div className="mr-[0.8rem] h-[48px] w-[48px] overflow-hidden rounded-[50%]">
      <Picture
        width={48}
        height={48}
        objectFit="cover"
        imageSrc={avatarSrc}
        imageAlt={nickName}
      />
    </div>
    <div>
      <p className="text-sans text-[1.4rem] font-normal leading-[2.7rem] text-black">
        {nickName}
      </p>
      <p className="text-sans text-[1.9rem] font-bold leading-[2.7rem] text-black">
        {fullName}
      </p>
    </div>
  </div>
);
