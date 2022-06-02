import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { getAuthorName } from '../../../utils/getAuthorName/getAuthorName';
import { TBlogHeaderAuthorProps } from '../types';

export const BlogHeaderAuthor: FC<TBlogHeaderAuthorProps> = ({
  firstName,
  lastName,
  githubNick,
  githubLink,
  authorImage,
}) => {
  const authorsName = getAuthorName(firstName, lastName);

  return (
    <section className="flex gap-[1.4rem] justify-start items-center">
      <div className="overflow-hidden relative w-[4.8rem] h-[4.8rem] rounded-full">
        <Picture
          imageSrc={authorImage.filename}
          imageAlt={authorImage.alt}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="flex flex-col justify-between items-start">
        <a
          href={githubLink.url}
          target="_blank"
          rel="noreferrer"
          className="text-[1.4rem] font-normal leading-[2.7rem]"
        >
          {githubNick}
        </a>
        <p className="text-[1.9rem] font-extrabold leading-[2.7rem] underline">
          {authorsName}
        </p>
      </div>
    </section>
  );
};
