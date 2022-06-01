import { FC, useEffect, useState } from 'react';

import tail from 'lodash/tail';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';

import { DomainVariant } from '@quansight/shared/types';
import {
  Footer,
  Header,
  Hero,
  HeroVariant,
  Layout,
  SEO,
} from '@quansight/shared/ui-components';

import { FooterItem, getFooter, HeaderItem, getHeader } from '../../api';
import { CategoryList } from '../../components/Posts/CategoryList/CategoryList';
import { PostListItem } from '../../components/Posts/PostListItem/PostListItem';
import { getAllPosts } from '../../services/api/posts/getAllPosts';
import { getCategories } from '../../services/api/posts/getCategories';
import { filterPosts } from '../../services/posts/filterPosts';
import { getPostsByPage } from '../../services/posts/getPostsByPage';
import { TPost } from '../../types/storyblok/bloks/posts';

export type BlogListPageProps = {
  posts: TPost[];
  footer: FooterItem;
  header: HeaderItem;
  categoryList: string[];
  category?: string;
};

const POSTS_OFFSET = 9;

const BlogListPage: FC<BlogListPageProps> = ({
  posts,
  footer,
  header,
  categoryList,
}) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pages, setPages] = useState<number>();
  const [filteredItems, setFilteredItems] = useState<TPost[]>([]);
  const [itemsToShow, setItemsToShow] = useState<TPost[]>([]);
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
      { shallow: true, scroll: true },
    );
  };

  const handleCategoryChange = (category: string): void => {
    const isTheSameCategory = category === selectedCategory;
    const firstPage = 1;

    setSelectedCategory(isTheSameCategory ? '' : category);
    setCurrentPage(firstPage);

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          category: isTheSameCategory ? '' : category,
          page: firstPage,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  useEffect(() => {
    const filtered = filterPosts(posts, selectedCategory);
    setFilteredItems(filtered);
  }, [posts, selectedCategory]);

  useEffect(() => {
    const sliceItems = getPostsByPage(filteredItems, currentPage, POSTS_OFFSET);
    setItemsToShow(sliceItems);
    const numberOfPages = Math.ceil(filteredItems.length / POSTS_OFFSET);
    setPages(numberOfPages);
  }, [currentPage, filteredItems]);

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
    <Layout
      footer={<Footer {...footer.content} />}
      header={<Header {...header.content} domainVariant={DomainVariant.Labs} />}
    >
      <SEO
        title="Blog"
        description="This is a blog list page"
        variant={DomainVariant.Labs}
      />
      <Hero
        variant={HeroVariant.Small}
        imageSrc="/postList/post-list-hero.jpeg"
        imageAlt="Blog post list hero image"
        backgroundColor="transparent"
        objectFit="cover"
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
        {itemsToShow.length > 0 && (
          <div className="mb-[4.2rem]">
            <PostListItem post={itemsToShow[0]} variant="horizontal" />
          </div>
        )}

        <div className="flex flex-wrap">
          {tail(itemsToShow).map((post) => {
            return (
              <div
                key={post.slug}
                className="odd:mr-[2%] mb-[3.7rem] w-full md:w-[49%]"
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
            pageRangeDisplayed={POSTS_OFFSET}
            className="flex"
            pageClassName={pageElementClassName}
            nextClassName={pageElementClassName}
            breakClassName={pageElementClassName}
            previousClassName={pageElementClassName}
            nextLinkClassName={pageLinkClassName}
            previousLinkClassName={pageLinkClassName}
            pageLinkClassName={pageLinkClassName}
            breakLinkClassName={pageLinkClassName}
            forcePage={currentPage - 1}
          />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const footer = await getFooter();
  const header = await getHeader();
  const categories = await getCategories();
  const { items } = await getAllPosts();

  return {
    props: {
      header,
      footer,
      categoryList: categories,
      posts: items,
    },
  };
};

export default BlogListPage;
