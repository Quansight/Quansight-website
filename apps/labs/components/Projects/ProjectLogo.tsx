import { FC } from 'react';

import clsx from 'clsx';

import { Picture } from '@quansight/shared/ui-components';

import { TProjectLogoProps } from './types';

export const ProjectLogo: FC<TProjectLogoProps> = ({
  isDroprownExpanded,
  imageSrc,
  imageAlt,
}) => (
  <div className="sm:col-start-2 sm:col-end-3 sm:row-start-1 sm:row-end-4 sm:pt-[3rem] sm:ml-[6rem] sm:w-[20rem] lg:w-[30rem] xl:w-[35rem]">
    {isDroprownExpanded && (
      <div className="w-full">
        {imageSrc && imageAlt && (
          <div
            className={clsx(
              'relative w-full h-[11.3rem] lg:h-[13.5rem] ',
              isDroprownExpanded ? 'sm:block' : 'sm:hidden',
            )}
          >
            <Picture imageSrc={imageSrc} imageAlt={imageAlt} layout="fill" />
          </div>
        )}
      </div>
    )}
  </div>
);
