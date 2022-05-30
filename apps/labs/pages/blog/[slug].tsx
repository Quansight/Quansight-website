import { readdir } from 'fs/promises';
import path from 'path';

import { FC } from 'react';

import clsx from 'clsx';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';

import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import {
  Footer,
  Header,
  Hero,
  HeroVariant,
  Layout,
  SEO,
} from '@quansight/shared/ui-components';

import { FooterItem, HeaderItem } from '../../api/types/basic';
import { getFooter } from '../../api/utils/getFooter';
import { getHeader } from '../../api/utils/getHeader';
import { LinkWithArrow } from '../../components/LinkWithArrow/LinkWithArrow';
import { FeaturedPosts } from '../../components/Post/FeaturedPosts/FeaturedPosts';
import { PostMetaSection } from '../../components/Post/PostMetaSection/PostMetaSection';
import { POSTS_DIRECTORY_PATH } from '../../services/api/posts/constants';
import { getPost } from '../../services/api/posts/getPost';
import { getPostsByCategory } from '../../services/api/posts/getPostsByCategory';
import { blogAllowedComponents } from '../../services/blogAllowedComponents';
import { TPost } from '../../types/storyblok/bloks/posts';

export type TBlogPostProps = {
  post: TPost | null;
  footer?: FooterItem;
  header?: HeaderItem;
  featuredPosts?: TPost[];
};

export const BlogPost: FC<TBlogPostProps> = ({
  post,
  footer,
  header,
  featuredPosts,
}) => {
  if (!post) {
    return null; // TODO we should do something when post is null
  }

  return (
    <Layout
      footer={<Footer {...footer.content} />}
      header={
        <Header {...header.content} domainVariant={DomainVariant.Quansight} />
      }
    >
      <SEO
        title={post.meta.title}
        description={post.meta.description}
        variant={DomainVariant.Labs}
      />
      {post.meta.hero && (
        <Hero
          {...post.meta.hero}
          variant={HeroVariant.Small}
          backgroundColor="transparent"
          objectFit="cover"
        />
      )}
      <article
        className={clsx(
          'pt-[7.5rem] pb-[11.4rem] mx-auto w-[95%] max-w-[100.17rem] border-gray-300 border-solid md:w-[85%] xl:w-[70%]',
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
      </article>

      {Boolean(featuredPosts.length) && (
        <div className="mx-auto w-[93%] max-w-[96rem] md:w-[83%] xl:w-[68%]">
          <FeaturedPosts posts={featuredPosts} />
        </div>
      )}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const postsFileNames = await readdir(path.join(POSTS_DIRECTORY_PATH));

    return {
      paths: postsFileNames
        .filter((filename) => /\.(md|mdx)$/.test(filename))
        .map((filename) => `/blog/${filename.replace(/\.(md|mdx)$/, '')}`),
      fallback: false,
    };
  } catch (error) {
    console.error(error);

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
  const header = await getHeader();
  const footer = await getFooter();
  const featuredPosts = await getPostsByCategory(
    post.meta.category,
    post.slug,
    2,
  );

  return {
    props: {
      post,
      header,
      footer,
      featuredPosts,
    },
  };
};

export default BlogPost;
