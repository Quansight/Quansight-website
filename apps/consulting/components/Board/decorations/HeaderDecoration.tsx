import { FC } from 'react';
import { Picture } from '@quansight/shared/ui-components';

export const HeaderDecoration: FC = () => (
  <div className="hidden absolute top-[6%] left-[6%] w-[16.6rem] h-[12.5rem] lg:block xl:top-[15%] xl:left-[2%]">
    <Picture
      imageSrc="/board/board-header-icon.svg"
      imageAlt="header geometric decoration"
      layout="responsive"
      width={166}
      height={125}
      priority
    />
  </div>
);
