import { FC } from 'react';

import { useRouter } from 'next/router';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';

import { Picture } from '@quansight/shared/ui-components';

import { PAGINATION_OFFSETT } from '../../utils/paginateLibraryTiles/constants';
import { PaginationIcon } from './PaginationIcon';
import PaginationDecorativeImage from './assets/library-decoration.svg';
import { PaginationOrientation, TPaginationProps } from './types';

export const Pagination: FC<TPaginationProps> = ({
  setCurrentPage,
  currentPage,
  paginationPages,
}) => {
  const router = useRouter();

  const shouldRenderPagination = currentPage && paginationPages ? true : false;

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

  return (
    <div className="flex relative justify-center items-center pb-[20rem] mt-[1.1rem] sm:pb-[31.8rem] sm:mt-[4.6rem]">
      {shouldRenderPagination && (
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
        className="absolute right-0 bottom-0 w-[26.832rem] h-[15.7rem] sm:top-0 sm:w-[41.388rem] sm:h-[24.217rem] xl:top-auto xl:right-[-15%] xl:bottom-0"
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
