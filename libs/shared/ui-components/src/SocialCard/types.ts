// og:url -  The canonical URL of your object that will be used as its permanent ID in the graph,
// example: https://labs.quansight.org/projects
// example: https://quansight.com/
// note: should it include query string params?
// like https://quansight.com/library?page=2&type=blog (?)
// url?: string;

// og:image - An image URL which should represent your object within the graph.
// aspect ratio: The recommended size for an OG Image is 1.91:1. The recommended pixel dimensions of 1200:630 px
// example: 'https://a.storyblok.com/f/152463/900x472/b289c484e3/qslabs-logo-opengraph-size.png';

// twitter:image for large summary cards
// 2:1 with minimum dimensions of 300x157 or maximum of 4096x4096 pixels.
// Images must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are supported.
// Only the first frame of an animated GIF will be used.
// SVG is not supported.

// twitter:image for small summary cards
// aspect ratio of 1:1 with minimum dimensions of 144x144 or maximum of 4096x4096 pixels.
// The image will be cropped to a square on all platforms.
// other specification's are similar to large summary cards

import { DomainVariant } from '@quansight/shared/types';

export type TSocialCardProps = {
  title: string;
  description: string;
  variant: DomainVariant;
  twitterImage?: string;
  ogImage?: string;
  alt?: string;
  summary_large_image?: boolean;
};
