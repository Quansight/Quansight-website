import React, { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TPost } from '../../../../types/storyblok/bloks/posts';

export type TFeaturedPostsProps = {
  posts: TPost[];
};

export const FeaturedPosts: FC<TFeaturedPostsProps> = ({ posts }) => {
  return (
    <div className="pt-[9.9rem] pb-[11.4rem]">
      <h3 className="mb-[5rem] text-[1.9rem] font-bold leading-[2.7rem] text-center text-black">
        More articles from our Blog
      </h3>

      <div className="flex flex-col sm:flex-row">
        {posts.map((post) => (
          <div
            className="mx-auto first:mb-[3.6rem] w-3/4 border border-gray-400 border-solid sm:first:mr-[2.2rem] sm:first:mb-0 sm:w-1/2"
            key={post.slug}
          >
            {post.meta.featuredImage && (
              <div className="relative w-full h-[20rem]">
                <Picture
                  layout="fill"
                  objectFit="cover"
                  imageSrc={post.meta.featuredImage.src}
                  imageAlt={post.meta.featuredImage.alt}
                />
              </div>
            )}
            <div className="px-[1.5rem] pt-[1.5rem] pb-[3rem]">
              <h4 className="text-[2.2rem] font-extrabold leading-[3.7rem] text-black">
                {post.meta.title}
              </h4>
              <p className="font-sans text-[1.2rem] font-normal leading-[2.7rem]">
                By {post.meta.author.nickName} {post.meta.published}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
