export type TQuoteProps = {
  imageSrc: string;
  imageAlt: string;
  testimonial: string;
  person: string;
  position: string;
};

export type TTestimonialProps = {
  header: string;
  text: string;
} & TQuoteProps;
