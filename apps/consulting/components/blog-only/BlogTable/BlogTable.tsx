import { FC } from 'react';

export type TBlogTableProps = {
  tableWidth: string; // Overall table width
  headings: Array<string>;
  data: Array<Array<string>>;
  headingCellClass: string;
};

export type TBlogTableRowProps = {
  rowData: Array<string>;
};

const makeHeadingCell = (cellData: string, cellClass: string) => {
  return <th className={cellClass}>{cellData}</th>;
};

export const BlogTable: FC<TBlogTableProps> = ({
  tableWidth = '2/5',
  headings = ['Heading 1', 'Heading 2'],
  data = [
    ['Cell 1,1', 'Cell 1,2'],
    ['Cell 2,1', 'Cell 2,2'],
  ],
  headingCellClass = 'pl-8 pr-12 w-64',
}) => {
  return (
    <div className="flex pl-16 md:justify-center md:pl-0 justify-left">
      <div className={`w-${tableWidth}`}>
        <table className="table-fixed">
          <thead>
            <tr></tr>
          </thead>
        </table>
      </div>
    </div>
  );
};
