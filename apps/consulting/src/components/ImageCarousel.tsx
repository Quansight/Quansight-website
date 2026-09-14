import type { CSSProperties, FC } from 'react';

type ImageCarouselProps = {
  images: { src: string; alt: string }[];
  // Widget-level padding/background/shadow/width -- see extract_widget_box
  // in the converter (home's "Trusted By" card).
  style?: CSSProperties;
};

// Static stand-in for Elementor's image-carousel widget (home's "Trusted
// By" logo strip): all logos at once in a wrapping grid, no slider. The
// live site autoplays 4 at a time; a JS carousel is a planned follow-up.
export const ImageCarousel: FC<ImageCarouselProps> = ({ images, style }) => (
  <div
    className="grid grid-cols-2 sm:grid-cols-4 gap-x-[2.8rem] gap-y-[3rem] items-center max-w-layout mx-auto w-full"
    style={style}
  >
    {images.map((image, i) => (
      <div key={i} className="flex items-center justify-center">
        <img
          src={image.src}
          alt={image.alt}
          className="max-h-[8rem] w-auto max-w-full object-contain"
        />
      </div>
    ))}
  </div>
);
