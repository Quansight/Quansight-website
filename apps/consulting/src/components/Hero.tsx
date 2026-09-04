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
  // Real per-page size (e.g. packaging-and-distribution's title is 70px,
  // not the sitewide-typical 50px) -- falls back to the old fixed size
  // when the source page didn't set one.
  titleSizePx?: number;
  titleFontWeight?: number;
  subTitle?: string;
  subTitleSizePx?: number;
  // WP's hero section can also carry a CTA button styled to overlay the
  // banner (e.g. "Book a Call", "Get in Touch") alongside title/subTitle.
  ctaText?: string;
  ctaUrl?: string;
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
  titleSizePx,
  titleFontWeight,
  subTitle,
  subTitleSizePx,
  ctaText,
  ctaUrl,
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
        // `flex justify-center` centers the title block vertically within
        // whatever height the hero actually ends up at -- load-bearing for
        // isMedium/isSmall, since their content now flows normally (auto-
        // height) rather than being absolutely centered via h-full; a
        // no-op for isLarge, which positions its own content with
        // `absolute` regardless.
        'relative overflow-hidden w-full flex flex-col justify-center',
        // isMedium/isSmall (the only variants any page actually uses) flow
        // their title/subtitle/CTA normally now (see below) rather than
        // absolutely-positioning them over a fixed-height box, so `min-h`
        // here is a real CSS minimum: Elementor sets one on the live site
        // too, and a hero with more overlay content (title+subtitle+CTA)
        // grows to fit it instead of clipping/cramming it into a fixed
        // box. isLarge still positions its content with `absolute` (for
        // its off-center overlay layout) and needs a non-auto ancestor
        // height for that positioning's percentages to resolve, so it
        // keeps a fixed `h`.
        isSmall && 'min-h-[73rem] md:min-h-[60vh]',
        isMedium && 'min-h-[73rem] md:min-h-[73rem]',
        isLarge && 'h-[730px] md:h-[970px]',
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
      <div
        className={clsx(
          'relative mx-auto max-w-layout',
          // isLarge's content is absolutely positioned at a specific
          // offset (below), which needs this wrapper's box to be the
          // *sized* positioning context -- h-full only resolves against a
          // non-auto ancestor height, which is exactly what isLarge's own
          // fixed `h-` (above) provides. isMedium/isSmall content flows
          // normally instead (no positioning context needed).
          isLarge && 'h-full',
        )}
      >
        {title && (
          <div
            className={clsx(
              'relative px-[2rem] md:px-0 py-[6rem] md:py-[8rem]',
              (isMedium || isSmall) &&
                'flex flex-col justify-center items-center w-full',
              isLarge &&
                'pt-[13rem] md:absolute md:pt-0 md:top-[28rem] md:left-[10%] md:w-[85%] lg:left-[14%] lg:w-1/2',
            )}
          >
            <h1
              className={clsx(
                'font-extrabold leading-[6rem] text-white font-heading',
                isLarge
                  ? 'mb-[1.5rem] text-[4rem] md:mb-[4rem] md:text-[5rem]'
                  : 'text-[5rem] text-center',
              )}
              style={{
                ...(titleSizePx ? { fontSize: `${titleSizePx / 10}rem` } : {}),
                ...(titleFontWeight ? { fontWeight: titleFontWeight } : {}),
              }}
            >
              {title}
            </h1>
            {subTitle && (
              <div
                className={clsx(
                  isLarge
                    ? 'text-[3rem] md:text-[4rem] font-extrabold leading-[4.8rem] text-white font-heading'
                    : // No max-width cap: WP's real subtitle widget has none
                      // either, and one narrower than the title's own
                      // max-w-layout wrapper wraps it into extra, needlessly
                      // short lines.
                      'mt-[1.5rem] text-[1.8rem] sm:text-[2.2rem] leading-[1.4] text-white',
                  (isMedium || isSmall) && 'text-center',
                )}
                style={
                  subTitleSizePx
                    ? { fontSize: `${subTitleSizePx / 10}rem` }
                    : undefined
                }
              >
                {subTitle}
              </div>
            )}
            {ctaText && ctaUrl && (
              <div
                className={clsx(
                  'mt-[2.5rem]',
                  (isMedium || isSmall) && 'flex justify-center',
                )}
              >
                {/* Real per-widget CSS confirmed sitewide on these hero CTAs
                    (e.g. getting-started-with-ai's "Get in Touch"): a 2px
                    white pill outline, transparent fill, and Elementor's
                    "grow" hover animation -- not ButtonLink's plain
                    triangle-link style used for in-body buttons. */}
                <a
                  href={ctaUrl}
                  className="inline-block px-[3rem] py-[1.2rem] text-[1.6rem] font-bold text-white rounded-full border-2 border-white transition-transform duration-300 hover:scale-[1.03]"
                >
                  {ctaText}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
