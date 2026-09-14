import type { FC } from 'react';
import { ImageBox } from './ImageBox';

type ImageBoxGridProps = {
  items: {
    image: string;
    imageAlt: string;
    description?: string;
    layout?: 'column' | 'row' | 'row-reverse';
  }[];
};

// See IconBoxGrid.tsx for why grid width scales with item count -- a
// single item nested inside a `columns` block cell should fill that
// column, not be squeezed into a third of it by a fixed 3-col grid.
const GRID_CLASS: Record<number, string> = {
  1: '',
  2: 'grid grid-cols-1 sm:grid-cols-2 gap-[1rem]',
};
const DEFAULT_GRID_CLASS =
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1rem]';

export const ImageBoxGrid: FC<ImageBoxGridProps> = ({ items }) => (
  // `w-full` alongside `max-w-layout mx-auto` is load-bearing, not
  // decorative: nested one grid per `columns` cell, this div is a flex
  // item of that cell's flex-col container, and CSS flexbox auto margins
  // (mx-auto) suppress cross-axis stretch by definition -- without an
  // explicit width, the grid would shrink to its own content's natural
  // width (different per item's text length) and get re-centered inside
  // the cell, shifting it left/right instead of lining up with siblings.
  // `w-full` gives the auto margins no free space left to absorb, so the
  // grid fills the cell (and `max-w-layout` still caps/centers it on a
  // page-level block wider than the layout max-width).
  <div
    className={`${
      GRID_CLASS[items.length] ?? DEFAULT_GRID_CLASS
    } max-w-layout mx-auto w-full`}
  >
    {items.map((item, i) => (
      <ImageBox
        key={i}
        image={item.image}
        imageAlt={item.imageAlt}
        description={item.description}
        layout={item.layout}
      />
    ))}
  </div>
);
