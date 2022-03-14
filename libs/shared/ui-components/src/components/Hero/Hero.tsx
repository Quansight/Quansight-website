import { FC } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { HeroVariant } from './types';
import { getHeroContentClassNames } from './utils/getHeroContentClassNames';
import { getHeroBackground } from './utils/getHeroBackground';
import { getHeroTitleClassNames } from './utils/getHeroTitleClassNames';
import { getHeroContainerClassNames } from './utils/getHeroContainerClassNames';

export type THeroProps = {
  variant: HeroVariant;
  title: string;
  subTitle?: string;
};

export const Hero: FC<THeroProps> = ({ title, subTitle, variant }) => {
  console.log(title, subTitle, variant);
  return (
    <div className={clsx(getHeroContainerClassNames(variant))}>
      <Image
        src={getHeroBackground(variant)}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
      <div className={clsx(getHeroContentClassNames(variant))}>
        <h2 className={clsx(getHeroTitleClassNames(variant))}>{title}</h2>
        {subTitle && (
          <h3 className="text-white text-heroSubTitle font-primary">
            {subTitle}
          </h3>
        )}
      </div>
    </div>
  );
};
