import { FC } from 'react';

export type TBlogTableProps = {
  tableWidth: string; // Overall table width
  headings: Array<string>;
  data: Array<Array<string>>;
  headingCellClass: string;
  regularCellClass: string;
};

const makeHeadingCell = (cellData: string, cellClass: string) => {
  return <th className={cellClass}>{cellData}</th>;
};

const makeHeadingCellPartial = (cellClass: string) => {
  return (cellData: string) => {
    return makeHeadingCell(cellData, cellClass);
  };
};

const makeHeadingRow = (cellData: Array<string>, cellClass: string) => {
  return <tr>{cellData.map(makeHeadingCellPartial(cellClass))}</tr>;
};

const makeRegularCell = (cellData: string, cellClass: string) => {
  return <td className={cellClass}>{cellData}</td>;
};

const makeRegularCellPartial = (cellClass: string) => {
  return (cellData: string) => {
    return makeRegularCell(cellData, cellClass);
  };
};

const makeRegularRow = (cellData: Array<string>, cellClass: string) => {
  return <tr>{cellData.map(makeRegularCellPartial(cellClass))}</tr>;
};

const makeRegularRowPartial = (cellClass: string) => {
  return (cellData: Array<string>) => {
    return makeRegularRow(cellData, cellClass);
  };
};

export const BlogTable: FC<TBlogTableProps> = ({
  tableWidth = '2/5',
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
      <div className={`w-${tableWidth}`}>
        <table className="table-fixed">
          <thead>{makeHeadingRow(headings, headingCellClass)}</thead>
          <tbody>
            {data.map(makeRegularRowPartial(regularCellClass))}
            <tr className="h-0">
              {/* This adds the bottom border line to the table */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
