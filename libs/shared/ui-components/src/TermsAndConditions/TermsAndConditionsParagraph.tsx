import { FC } from 'react';
import { TTermsAndConditionsParagraphProps } from './types';
import { createMarkup } from '@quansight/shared/utils';

export const TermsAndConditionsParagraph: FC<
  TTermsAndConditionsParagraphProps
> = ({ title, text }) => (
  <section>
    <h3>{title}</h3>
    <div
      className="order-3 text-[1.4rem] leading-[3.3rem] sm:order-2"
      dangerouslySetInnerHTML={createMarkup(text)}
    />
  </section>
);

export default TermsAndConditionsParagraph;
