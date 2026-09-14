import type { FC } from 'react';

type PlaceholderProps = {
  widget: string;
  note?: string;
};

// Stand-in for widget types not yet migrated (form, price-table, carousels,
// call-to-action) -- visible so page gaps are obvious to reviewers, rather
// than silently missing content.
export const Placeholder: FC<PlaceholderProps> = ({ widget, note }) => (
  <div className="p-[2rem] my-[2rem] text-[1.4rem] text-black border-2 border-dashed border-red">
    <strong>TODO:</strong> {widget} widget not yet migrated.
    {note && <p className="mt-[0.5rem]">{note}</p>}
  </div>
);
