import { FC } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import { THeroProps, HeroVariant } from './types';

export const Hero: FC<THeroProps> = ({
  title,
  subTitle,
  variant,
  imageSrc,
  imageAlt,
}) => {
  const isLargeHero = variant === HeroVariant.Large;
  const isMediumHero = variant === HeroVariant.Medium;

  return (
    <div
      className={clsx(
        'overflow-hidden w-full h-[730px] bg-[#000000]',
        isLargeHero && 'md:h-[970px]',
        isMediumHero && 'md:h-[730px]',
      )}
    >
      <div className="relative mx-auto h-full max-w-layout">
        <Image
          src={imageSrc}
          alt={imageAlt}
          layout="fill"
          objectFit="contain"
          objectPosition="center"
        />
        <div
          className={clsx(
            'relative px-[2rem] placeholder:md:px-0 pt-[8.8rem] md:absolute md:pt-0',
            isLargeHero && 'md:top-52 md:left-[14%] md:w-1/2',
            isMediumHero &&
              'flex flex-col justify-center items-center w-full h-full',
          )}
        >
          <h2
            className={clsx(
              'text-[5rem] leading-[6rem] text-white font-heading',
              isLargeHero ? 'mb-12' : 'text-center',
            )}
          >
            {title}
          </h2>
          {subTitle && (
            <h3
              className={clsx(
                'text-[4rem] leading-[4.8rem] text-white font-heading',
                isMediumHero && 'text-center',
              )}
            >
              {subTitle}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};
