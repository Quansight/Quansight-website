import type { FC } from 'react';

import { ButtonLink } from './ButtonLink';

type PriceTableProps = {
  heading?: string;
  subheading?: string;
  currency?: string;
  price: string;
  period?: string;
  features?: string[];
  buttonText?: string;
  buttonUrl?: string;
  // Real per-widget background for the price row -- confirmed to vary
  // sitewide (near-white #FAFAFA on one page's cards, unset/default on
  // another's) rather than being a single fixed sitewide value.
  priceBackground?: string;
};

// Elementor's price-table widget shows up in two real shapes sitewide: a
// minimal one (title + price only -- description and CTA are separate
// sibling widgets, converted normally elsewhere) and a fuller one with a
// features checklist and its own button. Both render through this one
// component; the parts that shape doesn't use are simply absent.
export const PriceTable: FC<PriceTableProps> = ({
  heading,
  subheading,
  currency,
  price,
  period,
  features,
  buttonText,
  buttonUrl,
  priceBackground,
}) => (
  <div className="flex flex-col w-full max-w-layout mx-auto">
    {heading && (
      <div className="px-[2rem] py-[2.4rem] text-center bg-violet">
        <h3 className="text-[2.2rem] font-medium leading-[1.3] text-white font-heading">
          {heading}
        </h3>
        {subheading && (
          <p className="mt-[0.5rem] text-[1.6rem] text-white">{subheading}</p>
        )}
      </div>
    )}
    <div
      className="px-[2rem] py-[3rem] text-center"
      style={{ backgroundColor: priceBackground ?? '#FAFAFF' }}
    >
      <span className="text-[2.4rem] font-bold text-violet">
        {currency}
        {price}
      </span>
      {period && (
        <span className="ml-[0.8rem] text-[1.6rem] italic font-semibold text-pink">
          {period}
        </span>
      )}
    </div>
    {features && features.length > 0 && (
      <ul
        className="flex flex-col gap-[2rem] px-[2rem] py-[3rem] text-left"
        style={{ backgroundColor: priceBackground ?? '#FAFAFF' }}
      >
        {features.map((feature, i) => (
          <li
            key={i}
            className="flex gap-[1rem] items-start text-[1.4rem] leading-[1.5] text-black"
          >
            <span aria-hidden="true" className="mt-[0.2rem] text-violet">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
    )}
    {buttonText && buttonUrl && (
      <div className="flex justify-center py-[2rem]">
        <ButtonLink url={buttonUrl} text={buttonText} color="violet" isFull />
      </div>
    )}
  </div>
);
