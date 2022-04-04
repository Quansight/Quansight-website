import { FC } from 'react';
import { TIntertwinedArticleProps } from './types';
import { createMarkup } from '@quansight/shared/ui-components';
import { IntertwinedArticleItem } from './IntertwinedArticleItem';

export const IntertwinedArticle: FC<TIntertwinedArticleProps> = ({
  title,
  sections,
  footer,
}) => {
  return (
    <article>
      <h2>{title}</h2>
      {sections.map((props) => (
        <IntertwinedArticleItem {...props} key={props._uid} />
      ))}
      {footer && <div dangerouslySetInnerHTML={createMarkup(footer)} />}
    </article>
  );
};
