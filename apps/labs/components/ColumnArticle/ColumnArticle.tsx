import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';
import { createMarkup } from '@quansight/shared/utils';

import { ColumnArticleHeader } from './ColumnArticleHeader';
import { TColumnArticleProps } from './types';

const columnsStyles = `
  md:flex
`;

export const ColumnArticle: FC<TColumnArticleProps> = ({
  header,
  leftColumn,
  rightColumn,
  final,
  imageSrc,
  imageAlt,
}) => (
  <article>
    {header && <ColumnArticleHeader header={header} level={2} />}
    <div className={columnsStyles}>
      <div dangerouslySetInnerHTML={createMarkup(leftColumn)} />
      <div dangerouslySetInnerHTML={createMarkup(rightColumn)} />
    </div>
    <div className={columnsStyles}>
      <div dangerouslySetInnerHTML={createMarkup(final)} />
      <div className="relative w-[10rem] h-[10rem]">
        <Picture imageSrc={imageSrc} imageAlt={imageAlt} layout="fill" />
      </div>
    </div>
  </article>
);
