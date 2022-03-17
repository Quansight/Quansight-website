import { FC } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { HeroVariant } from './types';
import { getHeroBackground } from './utils/getHeroBackground';

export type THeroProps = {
  variant: HeroVariant;
  title: string;
  subTitle?: string;
};

export const Hero: FC<THeroProps> = ({ title, subTitle, variant }) => {
  const isLargeHero = variant === HeroVariant.Large;
  const isMediumHero = variant === HeroVariant.Medium;

  return (
    <div
      className={clsx('relative', 'h-[730px]', {
        'md:h-[970px]': isLargeHero,
        'md:h-[730px]': isMediumHero,
      })}
    >
      <Image
        src={getHeroBackground(variant)}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
      <div
        className={clsx(
          'relative px-[2rem] placeholder:md:px-0 pt-[8.8rem] md:absolute md:pt-0',
          ...(isLargeHero ? ['md:w-1/2 md:top-52 md:left-[14%]'] : ''),
          ...(isMediumHero
            ? ['h-full w-full flex items-center justify-center flex-col']
            : ''),
        )}
      >
        <h2
          className={clsx(
            'text-[5rem] leading-[6rem] text-white font-heading',
            {
              'mb-12': isLargeHero,
              'text-center': !isLargeHero,
            },
          )}
        >
          {title}
        </h2>
        {subTitle && (
          <h3
            className={clsx(
              'text-[4rem] leading-[4.8rem] text-white font-heading',
              {
                'text-center': !isLargeHero,
              },
            )}
          >
            {subTitle}
          </h3>
        )}
      </div>
    </div>
  );
};
