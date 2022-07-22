import clsx from 'clsx';

import { TProjectHeadlineProps } from './types';

export const ProjectHeadline = ({
  isDroprownExpanded,
  toggleItemDropdown,
  title,
}: TProjectHeadlineProps) => (
  <div className="flex relative justify-between items-center w-full sm:col-start-1 sm:col-end-2">
    <h2
      id={title}
      className="shrink-0 text-[4rem] font-extrabold leading-[6.648rem] font-heading text-violet"
    >
      {title}
    </h2>
    <button
      onClick={toggleItemDropdown}
      className="flex absolute flex-row-reverse items-center w-[100%] h-[6rem]"
      aria-expanded={isDroprownExpanded}
    >
      <span className="sr-only">Read more of {title}</span>
      <span
        className={clsx(
          'border-x-8 border-t-8 border-x-transparent transition-all motion-reduce:transition-none duration-300 ease-in-out border-y-solid border-l-solid',
          isDroprownExpanded
            ? '-rotate-180 border-t-violet'
            : 'rotate-0 border-t-gray',
        )}
      />
    </button>
  </div>
);
