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
  SocialCard,
} from '@quansight/shared/ui-components';

import { FooterItem, HeaderItem } from '../../api/types/basic';
import { getFooter } from '../../api/utils/getFooter';
import { getHeader } from '../../api/utils/getHeader';
import { LinkWithArrow } from '../../components/LinkWithArrow/LinkWithArrow';
import { FeaturedPosts } from '../../components/Posts/FeaturedPosts/FeaturedPosts';
import { PostMetaSection } from '../../components/Posts/PostMetaSection/PostMetaSection';
import { getPost } from '../../services/api/posts/getPost';
import { getPostsByCategory } from '../../services/api/posts/getPostsByCategory';
import { blogAllowedComponents } from '../../services/blogAllowedComponents';
import { getAllPostFileNames } from '../../services/posts/getAllPostFileNames';
import { TPost } from '../../types/storyblok/bloks/posts';

export type TBlogPostProps = {
  post: TPost | null;
  footer?: FooterItem;
  header?: HeaderItem;
  featuredPosts?: TPost[];
  preview: boolean;
};

export const BlogPost: FC<TBlogPostProps> = ({
  post,
  footer,
  header,
  featuredPosts,
  preview,
}) => {
  if (!post) {
    return null; // TODO we should do something when post is null
  }

  return (
    <Layout
      footer={<Footer {...footer.content} />}
      header={
        <Header
          {...header.content}
          domainVariant={DomainVariant.Labs}
          preview={preview}
        />
      }
    >
      <SEO
        title={post.meta.title}
        description={post.meta.description}
        variant={DomainVariant.Labs}
      />
      <SocialCard
        title={post.meta.title}
        description={post.meta.description}
        variant={DomainVariant.Labs}
        twitterLargeImage={true}
        twitterImage={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}${post.meta.featuredImage.src}`}
        ogImage={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}${post.meta.featuredImage.src}`}
        alt={post.meta.featuredImage.alt}
      />
      {post.meta.hero && (
        <Hero
          {...post.meta.hero}
          variant={HeroVariant.Medium}
          backgroundColor="transparent"
          objectFit="cover"
        />
      )}
      <article
        className={clsx(
          'pt-[7.5rem] pb-[11.4rem] mx-auto w-[95%] max-w-[100.17rem] border-gray-100 border-solid md:w-[85%] xl:w-[70%]',
          {
            'border-b': featuredPosts.length,
          },
        )}
      >
        <LinkWithArrow href={'/blog'}>Back to blog</LinkWithArrow>
        <div className="mt-[1.8rem]">
          <PostMetaSection {...post.meta} />

          <div className="w-full max-w-none prose-code:text-[.95em] prose-code:font-normal prose-a:underline-offset-2 prose-code:before:content-none prose-code:after:content-none prose-code:bg-transparent prose-code:border-none prose hover:prose-a:text-violet focus:prose-a:text-violet prose-code:text-violet-code prose-code:font-code">
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
    const postsFileNames = getAllPostFileNames();

    return {
      paths: postsFileNames.map(
        (filename) => `/blog/${filename.replace(/\.(md|mdx)$/, '')}`,
      ),
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
> = async ({ params: { slug }, preview = false }) => {
  const post = await getPost(slug, preview);
  const header = await getHeader(preview);
  const footer = await getFooter(preview);
  const featuredPosts = await getPostsByCategory(
    post.meta.category,
    post.slug,
    2,
    preview,
  );

  return {
    props: {
      post,
      header,
      footer,
      featuredPosts,
      preview,
    },
  };
};

export default BlogPost;
