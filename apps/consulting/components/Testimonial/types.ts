export type TAvatarProps = {
  imageSrc: string;
  imageAlt: string;
};

export type TQuoteProps = {
  testimonial: string;
  person: string;
  position: string;
} & TAvatarProps;

export type TTestimonialProps = {
  header: string;
  text: string;
} & TQuoteProps;
