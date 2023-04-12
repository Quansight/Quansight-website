import clsx from 'clsx';

import { TProjectHeadlineProps } from './types';

export const ProjectHeadline = ({
  isDroprownExpanded,
  toggleItemDropdown,
  title,
}: TProjectHeadlineProps) => (
  <div className="relative flex w-full items-center justify-between sm:col-start-1 sm:col-end-2">
    <h2
      id={title}
      className="font-heading text-violet shrink-0 text-[4rem] font-extrabold leading-[6.648rem]"
    >
      {title}
    </h2>
    <button
      onClick={toggleItemDropdown}
      className="absolute flex h-[6rem] w-[100%] flex-row-reverse items-center"
      aria-expanded={isDroprownExpanded}
    >
      <span className="sr-only">Read more of {title}</span>
      <span
        className={clsx(
          'border-y-solid border-l-solid border-x-8 border-t-8 border-x-transparent transition-all duration-300 ease-in-out motion-reduce:transition-none',
          isDroprownExpanded
            ? 'border-t-violet -rotate-180'
            : 'border-t-gray rotate-0',
        )}
      />
    </button>
  </div>
);
