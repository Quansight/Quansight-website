import { FC } from 'react';

export type TBlogTableHeaderCell = {
  data: string;
  className: string;
};

export const BlogTableHeaderCell: FC<TBlogTableHeaderCell> = ({
  data,
  className,
}) => {
  return <th className={className}>{data}</th>;
};

export type TBlogTableHeaderRow = {
  dataArray: Array<string>;
  cellClassName: string;
};

export const BlogTableHeaderRow: FC<TBlogTableHeaderRow> = ({
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

export type TBlogTableCell = {
  data: string;
  className: string;
};

export const BlogTableCell: FC<TBlogTableCell> = ({ data, className }) => {
  return <td className={className}>{data}</td>;
};

export type TBlogTableRow = {
  dataRowArray: Array<string>;
  rowIndex: number;
  cellClassName: string;
};

export const BlogTableRow: FC<TBlogTableRow> = ({
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

export type TBlogTableProps = {
  tableDivClass: string; // For <div> surrounding the table
  headings: Array<string>; // Text for <th> header cells
  data: Array<Array<string>>; //  Text for <td> regular cells
  headingCellClass: string; // Class for <th> cells
  regularCellClass: string; // Class for <td> cells
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
