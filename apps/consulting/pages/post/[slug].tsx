import { FC } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';

import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import {
  Layout,
  SEO,
  Footer,
  Header,
  Hero,
  HeroVariant,
  MediaSeo,
} from '@quansight/shared/ui-components';

import { getFooter } from '../../api/utils/getFooter';
import { getHeader } from '../../api/utils/getHeader';
import { BlogHeader } from '../../components/BlogArticle/BlogHeader/BlogHeader';
import { BlogMoreArticles } from '../../components/BlogArticle/BlogMoreArticles/BlogMoreArticles';
import { blogAllowedComponents } from '../../services/posts/blogAllowedComponents';
import { POST_SLUG_DEFAULT_PREFIX } from '../../services/posts/constants';
import { getAllPostFileNames } from '../../services/posts/getLibraryPosts/getAllPostFileNames';
import { getPost } from '../../services/posts/getLibraryPosts/getPost';
import { getPostsByCategory } from '../../services/posts/getLibraryTiles/utils/getPostsByCategory';
import { TLibraryArticleProps } from '../../types/storyblok/bloks/libraryArticleProps';

const Article: FC<TLibraryArticleProps> = ({
  post,
  header,
  footer,
  featuredPosts,
  preview,
}) => {
  return (
    <Layout
      footer={<Footer {...footer.content} />}
      header={
        <Header
          {...header.content}
          domainVariant={DomainVariant.Quansight}
          preview={preview}
        />
      }
    >
      <SEO
        title={post.meta.title}
        description={post.meta.description}
        variant={DomainVariant.Quansight}
        type={post.meta.category.join(',')}
      >
        {post.meta.hero && (
          <MediaSeo
            image={
              post.meta.hero?.image || post.meta.hero?.imageTablet?.imageSrc
            }
            imageAlt={
              post.meta.hero?.imageAlt || post.meta.hero?.imageTablet?.imageAlt
            }
          />
        )}
      </SEO>

      {post.meta.hero && (
        <Hero
          {...post.meta.hero}
          variant={HeroVariant.Small}
          backgroundColor="transparent"
          objectFit="cover"
        />
      )}
      <article className="px-[2rem] mx-auto sm:px-[6rem] lg:px-[10rem] xl:px-[25rem] max-w-layout">
        <BlogHeader
          postTitle={post.meta.title}
          publishedDate={post.meta.published}
          author={post.meta.author}
        />
        <div className="prose-code:px-0 prose-pre:px-0 prose-img:mx-auto prose-figcaption:mt-[2rem] mb-[5rem] min-w-full prose-code:text-[.95em] text-[1.8rem]  prose-code:font-normal leading-[2.7rem] text-black prose-a:underline-offset-2 prose-code:before:content-none prose-code:after:content-none prose-code:bg-transparent prose-pre:bg-transparent prose-code:rounded-lg prose-code:border-none prose sm:prose-figcaption:mt-0 focus:prose-a:text-violet hover:prose-a:text-violet prose-code:text-violet-code prose-code:font-code">
          <MDXRemote {...post.content} components={blogAllowedComponents} />
        </div>
      </article>
      {Boolean(featuredPosts.length) && (
        <BlogMoreArticles featuredPosts={featuredPosts} />
      )}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const postsFileNames = getAllPostFileNames();

    return {
      paths: postsFileNames.map(
        (filename) =>
          `/${POST_SLUG_DEFAULT_PREFIX}/${filename.replace(/\.(md|mdx)$/, '')}`,
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
  TLibraryArticleProps,
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

export default Article;
