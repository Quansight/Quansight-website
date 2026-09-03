import type { FC } from 'react';

import clsx from 'clsx';

type HeroVariant =
  | 'small'
  | 'medium'
  | 'large'
  | 'large-overlapping'
  | 'medium-overlapping';

type HeroProps = {
  image?: string;
  imageAlt: string;
  imageDesktop?: string;
  imageTablet?: string;
  imageMobile?: string;
  objectFitDesktop?: 'cover' | 'contain';
  objectFitTablet?: 'cover' | 'contain';
  objectFitMobile?: 'cover' | 'contain';
  title?: string;
  subTitle?: string;
  variant: HeroVariant;
  objectFit?: 'cover' | 'contain';
  // WP/Elementor hero sections are a brand-color gradient with a decorative
  // image (e.g. a subtle dot pattern) overlaid at low opacity, rather than a
  // single full-strength background photo -- `image` still works standalone,
  // but pass these together to reproduce that look.
  gradientFrom?: string;
  gradientTo?: string;
  overlayOpacity?: number;
};

export const Hero: FC<HeroProps> = ({
  image,
  imageAlt,
  imageDesktop,
  imageTablet,
  imageMobile,
  objectFitDesktop,
  objectFitTablet,
  objectFitMobile,
  title,
  subTitle,
  variant,
  objectFit = 'cover',
  gradientFrom,
  gradientTo,
  overlayOpacity,
}) => {
  const hasGradient = gradientFrom && gradientTo;
  const isResponsive = imageDesktop || imageTablet || imageMobile;
  const responsiveFit =
    objectFitDesktop ?? objectFitTablet ?? objectFitMobile ?? 'contain';
  const isLarge = variant === 'large' || variant === 'large-overlapping';
  const isMedium = variant === 'medium' || variant === 'medium-overlapping';
  const isSmall = variant === 'small';

  return (
    <div
      className={clsx(
        'relative overflow-hidden w-full h-[730px]',
        isSmall && 'md:h-[60vh]',
        isLarge && 'md:h-[970px]',
        isMedium && 'md:h-[730px]',
        variant === 'large-overlapping' && 'mb-[-31rem] md:mb-[-39rem]',
        variant === 'medium-overlapping' && 'mb-[-10rem] md:mb-[-20rem]',
      )}
      style={
        hasGradient
          ? {
              background: `linear-gradient(180deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
            }
          : undefined
      }
    >
      {/* The background image spans the full section edge to edge, like
          the live site -- only the title/subtitle below are constrained
          to the page's normal content width. */}
      {hasGradient && image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit,
            objectPosition: 'center',
            opacity: overlayOpacity ?? 1,
          }}
        />
      ) : isResponsive ? (
        <picture
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {imageDesktop && (
            <source media="(min-width: 1024px)" srcSet={imageDesktop} />
          )}
          {imageTablet && (
            <source media="(min-width: 768px)" srcSet={imageTablet} />
          )}
          {(imageMobile || imageDesktop || imageTablet) && (
            <img
              src={imageMobile ?? imageTablet ?? imageDesktop}
              alt={imageAlt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: responsiveFit,
                objectPosition: 'center',
              }}
            />
          )}
        </picture>
      ) : image ? (
        <img
          src={image}
          alt={imageAlt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit,
            objectPosition: 'center',
          }}
        />
      ) : null}
      <div className="relative mx-auto h-full max-w-layout">
        {title && (
          <div
            className={clsx(
              'relative px-[2rem] md:px-0 pt-[13rem] md:absolute md:pt-0',
              (isMedium || isSmall) &&
                'flex flex-col justify-center items-center w-full h-full',
              isLarge &&
                'md:top-[28rem] md:left-[10%] md:w-[85%] lg:left-[14%] lg:w-1/2',
            )}
          >
            <h1
              className={clsx(
                'font-extrabold leading-[6rem] text-white font-heading',
                isLarge
                  ? 'mb-[1.5rem] text-[4rem] md:mb-[4rem] md:text-[5rem]'
                  : 'text-[5rem] text-center',
              )}
            >
              {title}
            </h1>
            {subTitle && (
              <div
                className={clsx(
                  'text-[4rem] font-extrabold leading-[4.8rem] text-white font-heading',
                  isLarge && 'text-[3rem] md:text-[4rem]',
                  (isMedium || isSmall) && 'text-center',
                )}
              >
                {subTitle}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
