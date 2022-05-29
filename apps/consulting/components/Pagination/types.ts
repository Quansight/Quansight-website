import { Dispatch, SetStateAction } from 'react';

export enum PaginationOrientation {
  Prev = 'previous',
  Next = 'next',
}

export type TPaginationIconProps = {
  orientation: PaginationOrientation;
};

export type TPaginationProps = {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  paginationPages: number;
};
