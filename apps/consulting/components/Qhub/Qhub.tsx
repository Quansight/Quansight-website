import { FC } from 'react';
import Image from 'next/image';

export type TQhubProps = {
  color: string,
  image: object,
  title: string,
  text: string
}


export const Qhub: FC<TQhubProps> = ({ color, image, title, text }) => {
  const textColor = color === 'green' ? 'black' : 'white';
  // const boxStyles = `bg-${color} text-${textColor}`;

  return (
    <section className={`relative max-w-layout mx-auto lg:my-20`}>
      <div className={`px-8 py-20 bg-green text-black md:w-3/4 md:pr-52 lg:pt-28 lg:pb-20 lg:pl-32 lg:pr-[340px] xl:pr-[420px]`}>
        <p className={`w-full mb-14 font-extrabold text-4xl md:mb-7`}>
          {title}
        </p>
        <p className={`w-full mb-20 text-base leading-7 md:mb-7`}>
          {text}
        </p>
        <img
          className={`w-full md:absolute md:w-2/5 md:top-1/2 md:right-8 md:-translate-y-1/2 lg:right-32`}
          src={image.filename} 
          alt={image.alt} 
        />
      </div>
    </section>
  )
}

