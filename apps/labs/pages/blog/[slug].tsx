import React, { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import clsx from 'clsx';
import path from 'path';
import { readdir } from 'fs/promises';
import { MDXRemote } from 'next-mdx-remote';
import { ISlugParams } from '@quansight/shared/types';
import { Api, FooterItem } from '@quansight/shared/storyblok-sdk';
import { DomainVariant, Layout, SEO } from '@quansight/shared/ui-components';

import { getPost } from '../../services/api/posts/getPost';
import { TPost } from '../../types/storyblok/bloks/posts';
import { blogAllowedComponents } from '../../services/blogAllowedComponents';
import { POSTS_DIRECTORY_PATH } from '../../services/api/posts/constants';
import { LinkWithArrow } from '../../components/LinkWithArrow/LinkWithArrow';
import { PostMetaSection } from '../../components/Post/PostMetaSection/PostMetaSection';
import { FeaturedPosts } from '../../components/Post/PostMetaSection/FeaturedPosts/FeaturedPosts';
import { getPostsByCategory } from '../../services/api/posts/getPostsByCateghory';

export type TBlogPostProps = {
  post: TPost | null;
  footer?: FooterItem;
  featuredPosts?: TPost[];
};

export const BlogPost: FC<TBlogPostProps> = ({
  post,
  footer,
  featuredPosts,
}) => {
  if (!post) {
    return null; // TODO we should do something when post is null
  }

  return (
    <Layout footer={footer}>
      <SEO
        title={post.meta.title}
        description={post.meta.description}
        variant={DomainVariant.Labs}
      />
      <div
        className={clsx(
          'pt-[7.5rem] pb-[11.4rem] mx-auto max-w-[1017px]  border-gray-300 border-solid',
          {
            'border-b': featuredPosts.length,
          },
        )}
      >
        <LinkWithArrow href={'/blog'}>Back to blog</LinkWithArrow>
        <div className="mt-[1.8rem]">
          <PostMetaSection {...post.meta} />

          <div className="w-full max-w-none prose">
            <MDXRemote {...post.content} components={blogAllowedComponents} />
          </div>
        </div>
      </div>

      {Boolean(featuredPosts.length) && <FeaturedPosts posts={featuredPosts} />}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const postsFileNames = await readdir(path.join(POSTS_DIRECTORY_PATH));

    return {
      paths: postsFileNames.map(
        (filename) => `/blog/${filename.replace(/\.(md|mdx)$/, '')}`,
      ),
      fallback: false,
    };
  } catch (error) {
    console.log(error);

    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<
  TBlogPostProps,
  ISlugParams
> = async ({ params: { slug } }) => {
  const post = await getPost(slug);
  const { data: footer } = await Api.getFooterItem();
  const featuredPosts = await getPostsByCategory(post.meta.category, post.slug);

  return {
    props: {
      post,
      footer: footer.FooterItem,
      featuredPosts,
    },
  };
};

export default BlogPost;
