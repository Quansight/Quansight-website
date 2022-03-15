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
          'relative',
          'md:absolute',
          'pt-[88px]',
          'md:pt-0',
          'px-[20px]',
          'md:px-0',
          ...(isLargeHero ? ['md:w-1/2', 'md:top-52', 'md:left-[14%]'] : []),
          ...(isMediumHero
            ? [
                'h-full',
                'w-full',
                'flex',
                'items-center',
                'justify-center',
                'flex-col',
              ]
            : []),
        )}
      >
        <h2
          className={clsx(
            'text-white',
            'text-[3.125rem]',
            'leading-[3.75rem]',
            'font-primary',
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
              'text-[2.5rem]',
              'leading-[3rem]',
              'text-white',
              'font-primary',
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
