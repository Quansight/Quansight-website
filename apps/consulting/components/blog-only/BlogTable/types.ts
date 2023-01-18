export type TBlogTableHeaderCellProps = {
  data: string;
  className: string;
};

export type TBlogTableHeaderRowProps = {
  dataArray: Array<string>;
  cellClassName: string;
};

export type TBlogTableCellProps = {
  data: string;
  className: string;
};

export type TBlogTableRowProps = {
  dataRowArray: Array<string>;
  rowIndex: number;
  cellClassName: string;
};

export type TBlogTableProps = {
  tableDivClass: string; // For <div> surrounding the table
  headings: Array<string>; // Text for <th> header cells
  data: Array<Array<string>>; //  Text for <td> regular cells
  headingCellClass: string; // Class for <th> cells
  regularCellClass: string; // Class for <td> cells
};
