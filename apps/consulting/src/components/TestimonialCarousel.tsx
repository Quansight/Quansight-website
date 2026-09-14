import { useEffect, useState, type FC } from 'react';

type TestimonialCarouselProps = {
  items: {
    text: string;
    name: string;
    title: string;
    image?: string;
    imageAlt?: string;
  }[];
};

// Elementor's testimonial-carousel widget as configured on home: one
// centered quote at a time, prev/next arrows at the edges, a bullet per
// quote, advancing every 5s with a 500ms slide, looping, paused while
// hovered. Two deliberate readability tweaks vs live: the arrows are
// mid-gray (live's are 90% white on white, effectively invisible) and
// inactive bullets are dimmed (live's are all solid black).
const INTERVAL_MS = 5000;
const SPEED_MS = 500;

export const TestimonialCarousel: FC<TestimonialCarouselProps> = ({
  items,
}) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const count = items.length;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setAutoplay(!reduced.matches);
    apply();
    reduced.addEventListener('change', apply);
    return () => reduced.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [autoplay, paused, count]);

  const go = (i: number) => setIndex(((i % count) + count) % count);

  return (
    <div
      className="relative max-w-layout mx-auto w-full pb-[4rem]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex w-full"
          style={{
            transform: `translateX(${-index * 100}%)`,
            transition: `transform ${SPEED_MS}ms ease`,
          }}
          aria-live={paused ? 'polite' : 'off'}
        >
          {items.map((item, i) => (
            <figure
              key={i}
              className="shrink-0 w-full p-[2rem] text-center"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index ? true : undefined}
            >
              <blockquote className="text-[1.8rem] leading-[2.7rem] italic text-black">
                {item.text}
              </blockquote>
              <figcaption className="flex items-center justify-center mt-[2.5rem]">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.imageAlt ?? ''}
                    className="w-[8rem] h-[8rem] rounded-full object-cover shrink-0 border border-[#dddddd]"
                  />
                )}
                <div className="flex flex-col text-left ml-[2rem]">
                  <span className="text-[1.8rem] font-semibold leading-[2.7rem] text-black font-heading">
                    {item.name}
                  </span>
                  <span className="text-[1.4rem] leading-[2.1rem] text-[#646464]">
                    {item.title}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 p-[1rem] text-[2rem] leading-none text-gray-400 hover:text-black"
          >
            &#8249;
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 p-[1rem] text-[2rem] leading-none text-gray-400 hover:text-black"
          >
            &#8250;
          </button>
          <div className="absolute bottom-[0.5rem] left-0 right-0 flex justify-center">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className={`w-[0.6rem] h-[0.6rem] mx-[0.6rem] rounded-full bg-black ${
                  i === index ? '' : 'opacity-30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
