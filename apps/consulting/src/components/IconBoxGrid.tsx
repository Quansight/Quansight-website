import type { FC } from 'react';
import { IconBox } from './IconBox';

type IconBoxGridProps = {
  items: {
    title?: string;
    description?: string;
    icon?: string;
    divider?: boolean;
  }[];
};

// A page-level flat run of icon-box widgets grids up to 3-wide, but a run
// nested inside a `columns` block cell (WP often puts one icon-box + one
// button in its own column, e.g. paired service cards) is already exactly
// as wide as its parent column -- forcing a 2/3-col grid on a single item
// leaves it filling only a third of that space instead of the whole thing.
const GRID_CLASS: Record<number, string> = {
  1: '',
  2: 'grid grid-cols-1 sm:grid-cols-2 gap-[1rem]',
};
const DEFAULT_GRID_CLASS =
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1rem]';

export const IconBoxGrid: FC<IconBoxGridProps> = ({ items }) => {
  // Elementor also uses this same widget to build a single-column divided
  // list (a bottom border on each row instead of a card grid) -- flagged
  // per-item by its own border CSS, see convert_icon_box in
  // convert-pages-consulting.py.
  const isList = items.some((item) => item.divider);
  const gridClass = isList
    ? 'flex flex-col'
    : GRID_CLASS[items.length] ?? DEFAULT_GRID_CLASS;
  // `w-full` is load-bearing here, not decorative -- see ImageBoxGrid.tsx.
  // Without it, `mx-auto` on a cell nested inside a `columns` flex-col
  // parent suppresses flex stretch (CSS flexbox auto-margin rule),
  // shrinking this div to its own content width and re-centering it
  // instead of lining up with sibling cells.
  return (
    <div className={`${gridClass} max-w-layout mx-auto w-full`}>
      {items.map((item, i) => (
        <IconBox
          key={i}
          title={item.title}
          description={item.description}
          icon={item.icon}
          divider={item.divider}
        />
      ))}
    </div>
  );
};
