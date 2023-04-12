import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

export const HeaderDecoration: FC = () => (
  <div className="absolute left-[6%] top-[6%] hidden h-[12.5rem] w-[16.6rem] lg:block xl:left-[2%] xl:top-[15%]">
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
