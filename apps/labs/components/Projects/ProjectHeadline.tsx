import { FC } from 'react';

import clsx from 'clsx';

import { TProjectHeadlineProps } from './types';

export const ProjectHeadline: FC<TProjectHeadlineProps> = ({
  isDroprownExpanded,
  setIsDropdownExpanded,
  title,
}) => (
  <div className="flex justify-between items-center w-full sm:col-start-1 sm:col-end-2">
    <h3 className="text-[4rem] font-extrabold leading-[6.648rem] font-heading text-violet">
      {title}
    </h3>
    <button
      onClick={() => setIsDropdownExpanded(!isDroprownExpanded)}
      className="flex relative justify-center items-center w-[3rem] h-[3rem]"
      aria-expanded={isDroprownExpanded}
    >
      <p className="sr-only">Read more of {title}</p>
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
