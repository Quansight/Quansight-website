import type { FC } from 'react';

type DataTableProps = {
  headers: string[];
  rows: string[][];
};

export const DataTable: FC<DataTableProps> = ({ headers, rows }) => (
  <table className="table-horizontal-scroll w-full text-[1.4rem] leading-[2.2rem] text-left border-collapse">
    <thead>
      <tr>
        {headers.map((h) => (
          <th
            key={h}
            className="p-[1rem] font-bold border border-gray-300 bg-gray-50"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) => (
            <td key={j} className="p-[1rem] border border-gray-300">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
