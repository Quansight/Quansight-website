import { FC } from 'react';

export type TBlogTableProps = {
  tableWidth: string; // Overall table width
  headings: Array<string>;
  data: Array<Array<string>>;
  headingCellClass: string;
  regularCellClass: string;
};

/**
 * Create the <th> element for a single header cell
 * @param cellData The text for the cell
 * @param cellClass The class for the cell
 * @returns <th> element
 */
const makeHeaderCell = (cellData: string, cellClass: string) => {
  return <th className={cellClass}>{cellData}</th>;
};

/**
 * Create a partial for a header cell around a given cell class
 * @param cellClass The class to embed into the partial
 * @returns Partial function with embedded class, taking the cell contents
 */
const makeHeaderCellPartial = (cellClass: string) => {
  return (cellData: string) => {
    return makeHeaderCell(cellData, cellClass);
  };
};

/**
 * Create a complete <tr> for the header row
 * @param cellData Array of string data, one element per header cell
 * @param cellClass The class to be used for all heading cells
 * @returns
 */
const makeHeaderRow = (cellData: Array<string>, cellClass: string) => {
  return <tr>{cellData.map(makeHeaderCellPartial(cellClass))}</tr>;
};

/**
 * Create a <td> for a cell in a regular table row
 * @param cellData Text to display in the cell
 * @param cellClass Class to apply to the cell
 * @returns <td> for the cell
 */
const makeRegularCell = (cellData: string, cellClass: string) => {
  return <td className={cellClass}>{cellData}</td>;
};

/**
 * Create a partial for a regular cell around a given cell class
 * @param cellClass The class to embed into the partial
 * @returns Partial function with embedded class, taking the cell contents
 */
const makeRegularCellPartial = (cellClass: string) => {
  return (cellData: string) => {
    return makeRegularCell(cellData, cellClass);
  };
};

/**
 * Create a complete <tr> for a regular row
 * @param cellData Array of strings of cell text, one element per cell
 * @param cellClass The class to apply to each regular cell
 * @returns <tr> for the row
 */
const makeRegularRow = (cellData: Array<string>, cellClass: string) => {
  return <tr>{cellData.map(makeRegularCellPartial(cellClass))}</tr>;
};

/**
 * Create a partial for a regular row, around a given cell class
 * @param cellClass The class to embed into the partial
 * @returns Partial function with embedded class, taking the row Array<string> contents
 */
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
          <thead>{makeHeaderRow(headings, headingCellClass)}</thead>
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
