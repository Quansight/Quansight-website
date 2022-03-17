import { FC } from 'react';
import clsx from 'clsx';

import { Picture } from '../Picture/Picture';
import { ButtonLink } from '../ButtonLink/ButtonLink';

import { TTeaserProps } from './types';

export const Teaser: FC<TTeaserProps> = ({
  color,
  imageSrc,
  imageAlt,
  title,
  text,
  buttonText,
  buttonLink,
}) => (
  <div className={`relative max-w-layout mx-auto lg:my-20`}>
    <div
      className={clsx(
        'py-20 px-8 lg:pt-28 lg:pr-[340px] lg:pl-32 lg:w-3/4 xl:pr-[420px]',
        color === 'green' && 'text-black bg-green',
        color === 'violet' && 'text-white bg-violet',
        color === 'pink' && 'text-white bg-pink',
      )}
    >
      <h2
        className={`w-full max-w-[440px] mb-14 font-extrabold text-4xl leading-tight lg:mb-7`}
      >
        {title}
      </h2>
      <p className={`w-full mb-14 text-base leading-7 md:mb-10`}>{text}</p>
      <div
        className={`w-full text-center lg:absolute lg:w-2/5 lg:top-1/2 lg:right-32 lg:-translate-y-1/2`}
      >
        <Picture
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          width={563}
          height={379}
        />
      </div>
      {buttonText && buttonLink && (
        <div className={`flex justify-center pt-6 lg:block lg:pt-0`}>
          <ButtonLink
            isBordered
            isTriangle
            color={color === 'green' ? 'violet' : 'white'}
            text={buttonText}
            url={buttonLink}
          />
        </div>
      )}
    </div>
  </div>
);

export default Teaser;
