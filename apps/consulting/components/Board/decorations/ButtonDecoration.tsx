import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

export const ButtonDecoration: FC = () => (
  <div className="absolute top-[85%] right-[5%] hidden h-[22.5rem] w-[37.1rem] lg:block xl:top-[77%] xl:right-[2%]">
    <Picture
      imageSrc="/board/board-btn-icon.svg"
      imageAlt=""
      layout="responsive"
      width={371}
      height={225}
      priority
    />
  </div>
);
