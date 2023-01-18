import { FC } from 'react';

import {
  TBlogTableHeaderCellProps,
  TBlogTableHeaderRowProps,
  TBlogTableCellProps,
  TBlogTableRowProps,
  TBlogTableProps,
} from './types';

export const BlogTableHeaderCell: FC<TBlogTableHeaderCellProps> = ({
  data,
  className,
}) => {
  return <th className={className}>{data}</th>;
};

export const BlogTableHeaderRow: FC<TBlogTableHeaderRowProps> = ({
  dataArray,
  cellClassName,
}) => {
  const rowItems = dataArray.map((dataValue: string, index: number) => (
    <BlogTableHeaderCell
      data={dataValue}
      className={cellClassName}
      key={`hdr-col-${index}`}
    />
  ));

  return <tr>{rowItems}</tr>;
};

export const BlogTableCell: FC<TBlogTableCellProps> = ({ data, className }) => {
  return <td className={className}>{data}</td>;
};

export const BlogTableRow: FC<TBlogTableRowProps> = ({
  dataRowArray,
  rowIndex,
  cellClassName,
}) => {
  return (
    <tr>
      {dataRowArray.map((cellData: string, colIndex: number) => (
        <BlogTableCell
          data={cellData}
          className={cellClassName}
          key={`cell-row${rowIndex}-col${colIndex}`}
        />
      ))}
    </tr>
  );
};

export const BlogTable: FC<TBlogTableProps> = ({
  tableDivClass = 'w-2/5',
  headings = ['Heading 1', 'Heading 2'],
  data = [
    ['Cell 1,1', 'Cell 1,2'],
    ['Cell 2,1', 'Cell 2,2'],
  ],
  headingCellClass = 'pl-8 pr-12 w-64',
  regularCellClass = 'px-12',
}) => {
  return (
    <div className="flex pl-16 md:justify-center md:pl-0 justify-left">
      <div className={tableDivClass}>
        <table className="table-fixed">
          <thead>
            <BlogTableHeaderRow
              dataArray={headings}
              cellClassName={headingCellClass}
            />
          </thead>
          <tbody>
            {data.map((dataRowArray: Array<string>, rowIndex: number) => (
              <BlogTableRow
                dataRowArray={dataRowArray}
                rowIndex={rowIndex}
                cellClassName={regularCellClass}
                key={`row${rowIndex}`}
              />
            ))}
            <tr className="h-0">
              {/* This adds the bottom border line to the table */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
