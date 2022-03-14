import { FC } from 'react';
import clsx from 'clsx';

import { Picture } from '../Picture';
import { ButtonLink } from '../ButtonLink';

import { TTeaserProps } from '../../types/components/Teaser';

export const Teaser: FC<TTeaserProps> = ({ color, image, title, text, btn, link }) => (
  <div className={`relative max-w-layout mx-auto lg:my-20`}>
    <div className={clsx(
      `px-8 py-20 md:pr-52 md:w-3/4 lg:pt-28 lg:pl-32 lg:pr-[340px] xl:pr-[420px]`,
      `bg-${color}`,
      color === 'green' ? 'text-black' : 'text-white',
    )}>
      <p className={`w-full max-w-[440px] mb-14 font-extrabold text-4xl md:mb-7`}>
        {title}
      </p>
      <p className={`w-full mb-20 text-base leading-7 md:mb-10`}>
        {text}
      </p>
      <div className={`w-full md:absolute md:w-2/5 md:top-1/2 md:right-8 md:-translate-y-1/2 lg:right-32`}>
        <Picture image={image} width={563} height={379} />
      </div>
      { link.url && (
        <ButtonLink 
          isBordered={true}
          isTriangle={true}
          color={color === 'green' ? 'violet' : 'white'} 
          text={btn} 
          link={link} 
        /> 
      )}
    </div>
  </div>
)
