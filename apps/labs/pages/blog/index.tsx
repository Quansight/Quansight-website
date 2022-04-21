import { FC, useEffect, useState } from 'react';

import { getPostsByPage } from 'apps/labs/services/posts/getPostsByPage';
import tail from 'lodash/tail';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';

import { Api } from '@quansight/shared/storyblok-sdk';
import { FooterItem } from '@quansight/shared/storyblok-sdk';
import { DomainVariant, Layout, SEO } from '@quansight/shared/ui-components';

import { CategoryList } from '../../components/Posts/CategoryList/CategoryList';
import { PostListItem } from '../../components/Posts/PostListItem/PostListItem';
import { DEFAULT_API_OFFSET } from '../../services/api/posts/constants';
import { getAllPosts } from '../../services/api/posts/getAllPosts';
import { getCategories } from '../../services/api/posts/getCategories';
import { filterPosts } from '../../services/posts/filterPosts';
import { TPost } from '../../types/storyblok/bloks/posts';

export type BlogListPageProps = {
  totalPosts: number;
  posts: TPost[];
  footer: FooterItem;
  categoryList: string[];
  pages: number;
  category?: string;
};

const BlogListPage: FC<BlogListPageProps> = ({
  posts,
  footer,
  categoryList,
}) => {
  const router = useRouter();
  const [postItems, setPostItems] = useState<TPost[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [currentPage, setCurrentPage] = useState<number>();

  const pages = Math.ceil(postItems.length / DEFAULT_API_OFFSET);

  const pageElementClassName =
    'text-[1.4rem] font-normal text-black leading-[2.7rem] font-sans hover:underline';
  const pageLinkClassName = 'p-[0.8rem]';

  const handleChangePage: ReactPaginateProps['onPageChange'] = ({
    selected,
  }): void => {
    setCurrentPage(selected + 1);

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page: selected + 1,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleCategoryChange = (category: string): void => {
    const isTheSameCategory = category === selectedCategory;
    setSelectedCategory(isTheSameCategory ? '' : category);

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          category: isTheSameCategory ? '' : category,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  useEffect(() => {
    const filteredItems = filterPosts(posts, selectedCategory);
    const sliceItems = getPostsByPage(filteredItems, currentPage);

    setPostItems(sliceItems);
  }, [currentPage, posts, selectedCategory]);

  // on start up
  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.category) {
      setSelectedCategory(router.query.category as string);
    }

    if (router.query.page) {
      setCurrentPage(parseInt(router.query.page as string, 10));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <Layout footer={footer}>
      <SEO
        title="Blog"
        description="This is a blog list page"
        variant={DomainVariant.Labs}
      />

      <div className="pt-[3rem] pb-[12.2rem] mx-auto w-[95%] max-w-[83rem] md:w-[85%] xl:w-[70%]">
        <h2 className="text-[2.4rem] font-extrabold leading-[4.9rem] text-heading text-violet">
          Posts, articles and tutorials
        </h2>

        <div className="mb-[3.5rem]">
          <CategoryList
            items={categoryList}
            onClick={handleCategoryChange}
            selectedCategory={selectedCategory}
          />
        </div>
        {postItems.length > 0 && (
          <div className="mb-[4.2rem]">
            <PostListItem post={postItems[0]} variant="horizontal" />
          </div>
        )}

        <div className="flex flex-wrap">
          {tail(postItems).map((post) => {
            return (
              <div
                key={post.slug}
                className="odd:mr-[4.1rem] mb-[3.7rem] w-1/2"
              >
                <PostListItem post={post} variant="vertical" />
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            nextAriaLabel="Next page"
            previousLabel="< Previous"
            previousAriaLabel="Previous page"
            onPageChange={handleChangePage}
            renderOnZeroPageCount={() => null}
            pageCount={pages}
            pageRangeDisplayed={DEFAULT_API_OFFSET}
            className="flex"
            pageClassName={pageElementClassName}
            nextClassName={pageElementClassName}
            breakClassName={pageElementClassName}
            previousClassName={pageElementClassName}
            nextLinkClassName={pageLinkClassName}
            previousLinkClassName={pageLinkClassName}
            pageLinkClassName={pageLinkClassName}
            breakLinkClassName={pageLinkClassName}
          />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data: footer } = await Api.getFooterItem();
  const categories = await getCategories();
  const { items } = await getAllPosts();

  return {
    props: {
      footer: footer.FooterItem,
      categoryList: categories,
      posts: items,
    },
  };
};

export default BlogListPage;
