import type { FC } from 'react';

type TestimonialCarouselProps = {
  items: {
    text: string;
    name: string;
    title: string;
    image?: string;
    imageAlt?: string;
  }[];
};

// Static stand-in for Elementor's testimonial-carousel widget (home's
// "Client Testimonials"): every quote side by side, no slider. The live
// site shows one at a time with arrows/bullets; a JS carousel is a planned
// follow-up.
export const TestimonialCarousel: FC<TestimonialCarouselProps> = ({
  items,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-[1rem] max-w-layout mx-auto w-full">
    {items.map((item, i) => (
      <figure
        key={i}
        className="flex flex-col justify-between gap-[2rem] p-[3rem] bg-lightgray"
      >
        <blockquote className="text-[1.8rem] leading-[2.7rem] text-black">
          {item.text}
        </blockquote>
        <figcaption className="flex items-center gap-[1.6rem]">
          {item.image && (
            <img
              src={item.image}
              alt={item.imageAlt ?? ''}
              className="w-[8rem] h-[8rem] rounded-full object-cover shrink-0"
            />
          )}
          <div>
            <p className="text-[1.8rem] font-semibold leading-[2.4rem] text-violet font-heading">
              {item.name}
            </p>
            <p className="text-[1.4rem] leading-[2.2rem] text-black">
              {item.title}
            </p>
          </div>
        </figcaption>
      </figure>
    ))}
  </div>
);
