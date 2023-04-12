import { FC } from 'react';

import clsx from 'clsx';

import { ButtonLink } from '../ButtonLink/ButtonLink';
import { ButtonColor } from '../ButtonLink/types';
import { Picture } from '../Picture/Picture';
import { TeaserColor, TTeaserProps } from './types';

export const Teaser: FC<TTeaserProps> = ({
  color,
  title,
  text,
  imageAlt,
  imageSrc,
  buttonText,
  buttonLink,
}) => (
  <div className={`max-w-layout relative mx-auto my-[6rem] lg:my-[7.6rem]`}>
    <div
      className={clsx(
        'px-[2.4rem] py-[9.2rem] lg:w-3/4 lg:pl-[13rem] lg:pr-[34rem] lg:pt-[11.8rem] xl:pr-[38rem]',
        color === TeaserColor.Green && 'bg-green text-black',
        color === TeaserColor.Violet && 'bg-violet text-white',
        color === TeaserColor.Pink && 'bg-pink text-white',
      )}
    >
      <h2
        className={`
          mb-[6.4rem] w-full max-w-[440px] text-[4rem] font-extrabold leading-[4.9rem]
          lg:mb-[2.6rem] lg:text-[4.8rem]
        `}
      >
        {title}
      </h2>
      <p
        className={`w-full pb-[2.6rem] text-[1.6rem] leading-[2.7rem] md:pb-10`}
      >
        {text}
      </p>
      <div
        className={`
          w-full text-center
          lg:absolute lg:right-32 lg:top-1/2 lg:w-2/5 lg:-translate-y-1/2
        `}
      >
        <Picture
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          width={563}
          height={379}
        />
      </div>
      {buttonText && buttonLink && (
        <div className={`flex justify-center pt-[3rem] lg:block lg:pt-0`}>
          <ButtonLink
            isBordered
            isTriangle
            color={color === 'green' ? ButtonColor.Violet : ButtonColor.White}
            text={buttonText}
            url={buttonLink}
          />
        </div>
      )}
    </div>
  </div>
);

export default Teaser;
