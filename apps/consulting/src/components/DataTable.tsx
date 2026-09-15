import type { FC } from 'react';

type DataTableProps = {
  headers: string[];
  // Cell text, with links kept as <a href> (see cell_html in the
  // converter) -- rendered as HTML, so links stay links.
  rows: string[][];
};

// Live's data tables (privacy-policy): a violet header row with white
// 16px/600 text, 14px cells padded 20px/15px with no borders, and
// alternate rows tinted gray.
export const DataTable: FC<DataTableProps> = ({ headers, rows }) => (
  <table className="table-horizontal-scroll w-full text-[1.4rem] leading-[2.2rem] text-left border-separate border-spacing-0 [&_a]:text-magenta [&_a]:hover:underline">
    <thead>
      <tr>
        {headers.map((h) => (
          <th
            key={h}
            className="px-[1.5rem] py-[2rem] text-[1.6rem] font-semibold text-white bg-[#613ea3]"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr
          key={i}
          className={
            i % 2 === 0 ? 'bg-[rgba(128,128,128,0.07)]' : 'bg-[#f2f2f2]'
          }
        >
          {row.map((cell, j) => (
            <td
              key={j}
              className="px-[1.5rem] py-[2rem] align-top"
              dangerouslySetInnerHTML={{ __html: cell }}
            />
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
