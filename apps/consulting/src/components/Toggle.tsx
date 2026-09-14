import type { FC } from 'react';

type ToggleProps = {
  // content is already-sanitized HTML from the WP source, not markdown.
  items: { title: string; content: string }[];
};

// CSS-only accordion via <details>/<summary>, no JS needed.
export const Toggle: FC<ToggleProps> = ({ items }) => (
  <div className="divide-y divide-gray-300">
    {items.map((item) => (
      <details key={item.title} className="py-[1.6rem] group">
        <summary className="text-[1.7rem] font-bold leading-[2.7rem] font-heading text-violet cursor-pointer list-none flex justify-between items-center">
          {item.title}
          <span className="ml-4 transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div
          className="pt-[1.2rem] text-[1.4rem] leading-[2.4rem] text-black"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </details>
    ))}
  </div>
);
