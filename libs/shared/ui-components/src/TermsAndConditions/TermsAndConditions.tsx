import { FC } from 'react';
import { TTermsAndConditionsProps } from './types';
import { TermsAndConditionsParagraph } from './TermsAndConditionsParagraph';

const TermsAndConditions: FC<TTermsAndConditionsProps> = ({
  title,
  paragraphs,
}) => (
  <article>
    <h2>{title}</h2>
    {paragraphs.map((paragraph) => (
      <TermsAndConditionsParagraph {...paragraph} key={paragraph._uid} />
    ))}
  </article>
);

export default TermsAndConditions;
