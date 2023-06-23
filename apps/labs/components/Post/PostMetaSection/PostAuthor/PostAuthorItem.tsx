import React, { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TPostAuthor } from '../../../../types/storyblok/bloks/posts';

export type TPostAuthorItemProps = TPostAuthor;

export const PostAuthorItem: FC<TPostAuthorItemProps> = ({
  nickName,
  fullName,
  avatarSrc,
}) => (
  <div className="flex items-center">
    <div className="overflow-hidden mr-[0.8rem] w-[54px] h-[54px] rounded-[50%]">
      <Picture
        width={54}
        height={54}
        objectFit="cover"
        imageSrc={avatarSrc}
        imageAlt={nickName}
      />
    </div>
    <div>
      <p className="text-[1.4rem] font-normal leading-[2.7rem] text-black text-sans">
        {nickName}
      </p>
      <p className="text-[1.9rem] font-bold leading-[2.7rem] text-black text-sans">
        {fullName}
      </p>
    </div>
  </div>
);
