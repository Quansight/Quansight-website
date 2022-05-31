import { FC } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { Picture } from '@quansight/shared/ui-components';

import { TPost } from '../../../types/storyblok/bloks/posts';

export type TPostListItem = {
  post: TPost;
  variant: 'horizontal' | 'vertical';
};

export const PostListItem: FC<TPostListItem> = ({ post, variant }) => (
  <div
    className={clsx('flex flex-row border border-gray-300 border-solid', {
      'flex-col': variant === 'vertical',
    })}
  >
    {post.meta.featuredImage && (
      <div
        className={clsx('relative mb-[1.1rem] w-full h-[20rem]', {
          'mb-0 w-1/2': variant === 'horizontal',
        })}
      >
        <Picture
          layout="fill"
          objectFit="cover"
          imageSrc={post.meta.featuredImage.src}
          imageAlt={post.meta.featuredImage.alt}
        />
      </div>
    )}
    <div
      className={clsx('px-[0.7rem] pb-[3rem]', {
        'pr-[4rem] pl-[2rem] w-1/2': variant === 'horizontal',
      })}
    >
      <h3
        className={clsx(
          'text-[2.4rem] font-extrabold leading-[3rem] text-heading text-violet',
          {
            'my-[2rem]': variant === 'horizontal',
          },
        )}
      >
        <Link href={`/blog/${post.slug}`}>
          <a>{post.meta.title}</a>
        </Link>
      </h3>
      <p className="text-[1.2rem] font-normal leading-[2.7rem] text-black text-sans">
        By {post.meta.author.fullName} {post.meta.published}
      </p>
    </div>
  </div>
);
