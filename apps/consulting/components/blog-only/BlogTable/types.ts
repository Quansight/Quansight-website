export type TBlogTableHeaderCellProps = {
  cellData: string;
  cellClassName: string;
};

export type TBlogTableHeaderRowProps = {
  rowData: Array<string>;
  cellClassName: string;
};

export type TBlogTableCellProps = {
  cellData: string;
  cellClassName: string;
};

export type TBlogTableRowProps = {
  rowData: Array<string>;
  rowIndex: number;
  cellClassName: string;
};

export type TBlogTableProps = {
  tableDivClass: string; // For <div> surrounding the table
  headings: Array<string>; // Text for <th> header cells
  tableData: Array<Array<string>>; //  Text for <td> regular cells
  headingCellClassName: string; // Class for <th> cells
  regularCellClassName: string; // Class for <td> cells
};
