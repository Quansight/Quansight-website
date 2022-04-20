import { FC } from 'react';

import { Triangle } from './Triangle';
import { Quote } from './Quote/Quote';

import { TTestimonialProps } from './types';

export const Testimonial: FC<TTestimonialProps> = ({
  header,
  text,
  imageSrc,
  imageAlt,
  testimonial,
  person,
  position,
}) => (
  <section className="md:py-[5rem]">
    <div className="relative text-white bg-pink">
      <Triangle />
      <div className="pt-[3.6rem] pb-[14rem] mx-auto md:pt-[11rem] md:pb-[30rem] max-w-layout">
        <div className="px-[2.4rem] md:flex md:gap-[7rem] lg:px-[13rem]">
          <h2 className="text-[4rem] font-extrabold leading-[4.9rem] md:w-1/2 md:text-[4.8rem]">
            {header}
          </h2>
          <p className="mt-[3.6rem] text-[1.6rem] leading-[2.7rem] md:mt-0 md:w-1/2">
            {text}
          </p>
        </div>
      </div>
    </div>
    <div className="px-[2.4rem] mt-[-6.6rem] md:px-[8rem] md:mt-[-20rem]">
      <Quote
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        testimonial={testimonial}
        person={person}
        position={position}
      />
    </div>
  </section>
);
