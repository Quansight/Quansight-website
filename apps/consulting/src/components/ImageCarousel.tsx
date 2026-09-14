import { useEffect, useState, type CSSProperties, type FC } from 'react';

type ImageCarouselProps = {
  images: { src: string; alt: string }[];
  // Widget-level padding/background/shadow/width -- see extract_widget_box
  // in the converter (home's "Trusted By" card).
  style?: CSSProperties;
};

// Elementor's image-carousel widget as configured on home's "Trusted By"
// strip: 4 logos visible (2 on small screens), 100px apart, advancing one
// logo every 5s with a 500ms slide, looping forever, no arrows, no pause
// on hover. Loops seamlessly by appending a copy of the first `visible`
// logos: once the slide onto the copies finishes, the track snaps back to
// the real first logo without animating.
const INTERVAL_MS = 5000;
const SPEED_MS = 500;
const GAP_PX = 100;

export const ImageCarousel: FC<ImageCarouselProps> = ({ images, style }) => {
  const [visible, setVisible] = useState(4);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const count = images.length;

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 639px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      setVisible(narrow.matches ? 2 : 4);
      setAutoplay(!reduced.matches);
    };
    apply();
    narrow.addEventListener('change', apply);
    reduced.addEventListener('change', apply);
    return () => {
      narrow.removeEventListener('change', apply);
      reduced.removeEventListener('change', apply);
    };
  }, []);

  useEffect(() => {
    if (!autoplay || count <= visible) return;
    const id = window.setInterval(() => setIndex((i) => i + 1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [autoplay, count, visible]);

  // Re-enable the transition one frame after snapping back, so the snap
  // itself never animates.
  useEffect(() => {
    if (animate) return;
    const id = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => setAnimate(true)),
    );
    return () => window.cancelAnimationFrame(id);
  }, [animate]);

  const onTransitionEnd = () => {
    if (index >= count) {
      setAnimate(false);
      setIndex(index - count);
    }
  };

  const slides =
    count > visible ? [...images, ...images.slice(0, visible)] : images;
  const gap = count > visible ? GAP_PX : GAP_PX / 2;
  // Slide width and the per-step shift are both expressed against the
  // track's own width, which equals the viewport's (width:100%), so the
  // percentage inside translateX resolves correctly.
  const slideWidth = `calc((100% - ${(visible - 1) * gap}px) / ${visible})`;
  const shift = `calc(${-index} * (${slideWidth} + ${gap}px))`;

  return (
    <div
      className="max-w-layout mx-auto w-full overflow-hidden"
      style={style}
      role="region"
      aria-roledescription="carousel"
      aria-label="Trusted by"
    >
      <div
        className="flex items-center w-full"
        style={{
          transform: `translateX(${shift})`,
          transition: animate ? `transform ${SPEED_MS}ms ease` : 'none',
        }}
        onTransitionEnd={onTransitionEnd}
        aria-live="off"
      >
        {slides.map((image, i) => (
          <div
            key={i}
            className="flex items-center justify-center shrink-0"
            style={{ width: slideWidth, marginRight: `${gap}px` }}
            role="group"
            aria-roledescription="slide"
            aria-hidden={i >= count ? true : undefined}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="max-h-[6rem] w-auto max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
