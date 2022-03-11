import { FC, useEffect } from 'react';
import Image from 'next/image';

import { ButtonLink } from '../ButtonLink';

export type TQhubProps = {
  color: string,
  image: object,
  title: string,
  text: string,
  btn: string,
  url: string
};

const variantStyles = {
  violet: 'bg-violet text-white',
  pink: 'bg-pink text-white',
  green: 'bg-green text-black'
};

export const Qhub: FC<TQhubProps> = ({ color, image, title, text, btn, url }) => {
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
          <Image src={image.filename} alt={image.alt} width={563} height={379} />
        </div>
        { url && <ButtonLink type='bordered' color={btnColor} text={btn} link={url} /> }
      </div>
    </div>
  )
};
