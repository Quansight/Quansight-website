import { FC } from 'react';

import { Triangle } from './Triangle';
import { Quote } from './Quote';

import { TTestimonialProps } from './types';

export const Testimonial: FC<TTestimonialProps> = ({
  header,
  text,
  imageSrc,
  imageAlt,
  testimonial,
  person,
  position,
}) => {
  return (
    <section>
      <div className="relative text-white bg-pink">
        <Triangle />
        <div className="pt-[3.6rem] pb-[13rem] mx-auto md:pt-[11rem] md:pb-[30rem] max-w-layout">
          <div className="px-[2.4rem] md:flex md:gap-[7rem] lg:px-[13rem]">
            <h2
              className="
                mb-[3.6rem] text-[4rem] font-extrabold leading-[4.9rem] md:w-1/2
                md:text-[4.8rem] border-box
              "
            >
              {header}
            </h2>
            <p className="text-[1.6rem] leading-[2.7rem] md:w-1/2 border-box">
              {text}
            </p>
          </div>
        </div>
      </div>
      <div>
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
};
