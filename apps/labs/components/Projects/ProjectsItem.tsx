import { FC, useState } from 'react';

import clsx from 'clsx';

import { Picture } from '@quansight/shared/ui-components';
import { createMarkup } from '@quansight/shared/utils';

import { TProjectItemProps } from './types';

export const ProjectsItem: FC<TProjectItemProps> = ({
  title,
  imageSrc,
  imageAlt,
  shortDescription,
  longDescription,
  linkText,
  linkUrl,
}) => {
  const [isDroprownExpanded, setIsDropdownExpanded] = useState(false);
  return (
    <div className="flex flex-col sm:flex-row-reverse sm:gap-[6rem] xl:gap-[6.4rem]">
      <div className="w-full sm:max-w-[20rem] lg:max-w-[30rem] xl:max-w-[35rem]">
        <div
          className={clsx(
            'relative w-full h-[11.3rem] sm:mt-[3rem] lg:h-[13.5rem]',
            isDroprownExpanded ? 'sm:block' : 'sm:hidden',
          )}
        >
          <Picture imageSrc={imageSrc} imageAlt={imageAlt} layout="fill" />
        </div>
      </div>
      <div className="pb-[2.8rem] w-full border-b border-b-gray-500">
        <div className="flex justify-between items-center">
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
        <div className="sm:pr-[5rem] xl:pr-0">
          <div
            className=" prose-p:leading-[2.1rem] text-black prose"
            dangerouslySetInnerHTML={createMarkup(shortDescription)}
          />
          {isDroprownExpanded && (
            <div className="mt-[2rem] w-full">
              <div
                className="mb-[4rem] prose-p:leading-[2.1rem] text-black prose"
                dangerouslySetInnerHTML={createMarkup(longDescription)}
              />
              <a
                aria-label={`Go to the ${title} project's page`}
                href={linkUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[1.6rem] font-bold leading-[1.8rem] border-b-2 text-violet border-b-violet"
              >
                {linkText}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
