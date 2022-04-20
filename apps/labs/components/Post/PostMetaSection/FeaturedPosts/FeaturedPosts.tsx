import Image from 'next/image';
import React, { FC } from 'react';
import { TPost } from '../../../../types/storyblok/bloks/posts';

export type TFeaturedPostsProps = {
  posts: TPost[];
};

export const FeaturedPosts: FC<TFeaturedPostsProps> = ({ posts }) => {
  return (
    <div className="pt-[9.9rem] pb-[11.4rem]">
      <h3 className="mb-[5rem] text-[1.9rem] font-bold leading-[2.7rem] text-black">
        More articles from our Blog
      </h3>

      {posts.map((post) => (
        <div
          className="first:mr-[2.2rem] w-1/2 border-gray-400 border-solid border-w"
          key={post.slug}
        >
          {post.meta.featuredImage && (
            <Image
              src={post.meta.featuredImage.src}
              alt={post.meta.featuredImage.alt}
            />
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
  );
};
