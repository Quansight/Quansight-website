import { FC } from 'react';

import { Picture, TStoryblokImageProps } from '../Picture';
import { ButtonLink, TStoryblokLinkProps } from '../ButtonLink';

export type TTeaserProps = {
  color: string,
  image: TStoryblokImageProps,
  title: string,
  text: string,
  btn?: string,
  link?: TStoryblokLinkProps
};

const variantStyles = {
  violet: 'bg-violet text-white',
  pink: 'bg-pink text-white',
  green: 'bg-green text-black'
};

export const Teaser: FC<TTeaserProps> = ({ color, image, title, text, btn, link }) => {
  const btnColor = color === 'green' ? 'violet' : 'white';

  return (
    <div className={`relative max-w-layout mx-auto lg:my-20`}>
      <div className={`${variantStyles[color]} px-8 py-20 md:pr-52 md:w-3/4 lg:pt-28 lg:pl-32 lg:pr-[340px] xl:pr-[420px]`}>
        <p className={`w-full max-w-[440px] mb-14 font-extrabold text-4xl md:mb-7`}>
          {title}
        </p>
        <p className={`w-full mb-20 text-base leading-7 md:mb-10`}>
          {text}
        </p>
        <div className={`w-full md:absolute md:w-2/5 md:top-1/2 md:right-8 md:-translate-y-1/2 lg:right-32`}>
          <Picture storyblokImg={image} width={563} height={379} />
        </div>
        { link.url && <ButtonLink type='bordered' color={btnColor} text={btn} link={link} /> }
      </div>
    </div>
  )
};
