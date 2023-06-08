import { DomainVariant } from '@quansight/shared/types';

type TSocialCardPropsBase = {
  /**
   * A concise title for the related content.
   * Platform specific behaviors for twitter:
   *  - iOS, Android: Truncated to two lines in timeline and expanded Tweet
   *  - Web: Truncated to one line in timeline and expanded Tweet
   * More info: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary
   */
  title: string;

  /**
   * You should not re-use the title as the description or use this field to describe the general services provided by the website.
   * Platform specific behaviors for twitter:
   *  - iOS, Android: Not displayed
   *  - Web: Truncated to three lines in timeline and expanded Tweet
   * More info: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
   */
  description: string;

  /**
   * Uses DomainVariant enum values if the optional properties are not added
   * SocialCard component uses it to set default images and alt based on the variant value.
   */
  variant: DomainVariant;
};

export type TSocialCardPropsDefaultImage = TSocialCardPropsBase;

// If you supply a customized social card image, you must supply the same image
// for both Twitter and Open Graph, and it must have alt text.
export type TSocialCardPropsCustomizedImage = TSocialCardPropsBase & {
  /**
   * twitter:image for large summary cards:
   * absolute URL must be used rather than relative URL.
   * 2:1 with minimum dimensions of 300x157 or maximum of 4096x4096 pixels.
   * Images must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are supported.
   * Only the first frame of an animated GIF will be used.
   * SVG is not supported.
   * more info: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image.
   *
   * twitter:image for small summary cards:
   * twitter:image should be absolute URL.
   * aspect ratio of 1:1 with minimum dimensions of 144x144 or maximum of 4096x4096 pixels.
   * The image will be cropped to a square on all platforms.
   * other specification's are similar to large summary cards.
   */
  twitterImage: string;

  /**
   * og:image
   * absolute URL must be used rather than relative URL approach.
   * aspect ratio: The recommended size for an OG Image is 1.91:1.
   * The recommended pixel dimensions of 1200:630 px.
   */
  ogImage: string;

  /**
   * A text description of the image conveying the essential nature of an image to users who are visually impaired.
   * Maximum 420 characters for twitter.
   * but for Open Graph there’s no official guidance on this, but 40 characters for mobile and 60 for desktop is roughly the sweet spot.
   * More info: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
   */
  alt: string;

  /**
   * The `summaryLargeImage` prop controls whether the large or small Twitter summary card will be used.
   * The `SocialCard` component *should* be configured with a `true` default value for this prop.
   * Remember to use the twitter:image that fits aspect ratio of 2:1 when summaryLargeImage is true.
   * with minimum dimensions of 300x157 or maximum of 4096x4096 pixels (see twitterImage type above for more details).
   * full-width prominent image alongside a tweet. It is designed to give the reader a rich photo experience,
   * and clicking on the image brings the user to your website.
   * More info: `https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image`
   */
  summaryLargeImage?: boolean;
};

export type TSocialCardProps =
  | TSocialCardPropsDefaultImage
  | TSocialCardPropsCustomizedImage;
