import { FC } from 'react';

import { useRouter } from 'next/router';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';

import { Picture } from '@quansight/shared/ui-components';

import { PAGINATION_OFFSETT } from '../../utils/paginateLibraryTiles/constants';
import { PaginationIcon } from './PaginationIcon';
import PaginationDecorativeImage from './assets/library-decoration.svg';
import { PaginationOrientation, TPaginationProps } from './types';

export const Pagination: FC<TPaginationProps> = ({
  onPageChange,
  currentPage,
  paginationPages,
}) => {
  const router = useRouter();

  const shouldRenderPagination = currentPage && paginationPages;

  const handleChangePage: ReactPaginateProps['onPageChange'] = ({
    selected,
  }): void => {
    onPageChange(selected + 1);
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

  return (
    <div className="relative mt-[1.1rem] flex items-center justify-center pb-[20rem] sm:mt-[4.6rem] sm:pb-[31.8rem]">
      {!!shouldRenderPagination && (
        <ReactPaginate
          breakLabel="..."
          nextLabel={
            <PaginationIcon orientation={PaginationOrientation.Next} />
          }
          nextAriaLabel="Next page"
          previousLabel={
            <PaginationIcon orientation={PaginationOrientation.Prev} />
          }
          previousAriaLabel="Previous page"
          onPageChange={handleChangePage}
          renderOnZeroPageCount={() => null}
          forcePage={currentPage - 1}
          disableInitialCallback={true}
          pageCount={paginationPages}
          pageRangeDisplayed={PAGINATION_OFFSETT}
          containerClassName="flex gap-[2rem] justify-center items-center w-full"
          activeLinkClassName="active-link-classname"
          disabledClassName="hidden"
          pageLinkClassName="page-link-classname"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute right-0 bottom-0 h-[15.7rem] w-[26.832rem] sm:top-0 sm:h-[24.217rem] sm:w-[41.388rem] xl:top-auto xl:right-[-15%] xl:bottom-0"
      >
        <Picture
          imageSrc={PaginationDecorativeImage}
          imageAlt="Library page decoration"
          layout="fill"
        />
      </div>
    </div>
  );
};
