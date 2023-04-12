import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

export const HeaderDecoration: FC = () => (
  <div className="absolute top-[6%] left-[6%] hidden h-[12.5rem] w-[16.6rem] lg:block xl:top-[15%] xl:left-[2%]">
    <Picture
      imageSrc="/board/board-header-icon.svg"
      imageAlt=""
      layout="responsive"
      width={166}
      height={125}
      priority
    />
  </div>
);
