import { FC } from 'react';

import {
  TBlogTableHeaderCellProps,
  TBlogTableHeaderRowProps,
  TBlogTableCellProps,
  TBlogTableRowProps,
  TBlogTableProps,
} from './types';

export const BlogTableHeaderCell: FC<TBlogTableHeaderCellProps> = ({
  cellData,
  cellClassName,
}) => {
  return <th className={cellClassName}>{cellData}</th>;
};

export const BlogTableHeaderRow: FC<TBlogTableHeaderRowProps> = ({
  rowData,
  cellClassName,
}) => {
  const rowCells = rowData.map((cellValue: string, index: number) => (
    <BlogTableHeaderCell
      cellData={cellValue}
      cellClassName={cellClassName}
      key={`hdr-col-${index}`}
    />
  ));

  return <tr>{rowCells}</tr>;
};

export const BlogTableCell: FC<TBlogTableCellProps> = ({
  cellData,
  cellClassName,
}) => {
  return <td className={cellClassName}>{cellData}</td>;
};

export const BlogTableRow: FC<TBlogTableRowProps> = ({
  rowData,
  rowIndex,
  cellClassName,
}) => {
  const rowCells = rowData.map((cellData: string, colIndex: number) => (
    <BlogTableCell
      cellData={cellData}
      cellClassName={cellClassName}
      key={`cell-row${rowIndex}-col${colIndex}`}
    />
  ));

  return <tr>{rowCells}</tr>;
};

export const BlogTable: FC<TBlogTableProps> = ({
  tableDivClass = 'w-2/5',
  headings = ['Heading 1', 'Heading 2'],
  tableData = [
    ['Cell 1,1', 'Cell 1,2'],
    ['Cell 2,1', 'Cell 2,2'],
  ],
  headingCellClassName = 'pl-8 pr-12 w-64',
  regularCellClassName = 'px-12',
}) => {
  const rowsItems = tableData.map(
    (rowData: Array<string>, rowIndex: number) => (
      <BlogTableRow
        rowData={rowData}
        rowIndex={rowIndex}
        cellClassName={regularCellClassName}
        key={`row${rowIndex}`}
      />
    ),
  );

  return (
    <div className="flex pl-16 md:justify-center md:pl-0 justify-left">
      <div className={tableDivClass}>
        <table className="table-fixed">
          <thead>
            <BlogTableHeaderRow
              rowData={headings}
              cellClassName={headingCellClassName}
            />
          </thead>
          <tbody>
            {rowsItems}
            <tr className="h-0">
              {/* This adds the bottom border line to the table */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
