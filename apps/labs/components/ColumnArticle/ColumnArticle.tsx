import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { ColumnArticleFragment } from './ColumnArticleFragment';
import { ColumnArticleHeader } from './ColumnArticleHeader';
import { TColumnArticleProps } from './types';

export const ColumnArticle: FC<TColumnArticleProps> = ({
  header,
  leftColumn,
  rightColumn,
  final,
  imageSrc,
  imageAlt,
}) => {
  const headerModifier = header ? -1 : 0;

  return (
    <article className="py-[10rem] mx-auto xl:px-[18rem] max-w-layout">
      {header && (
        <ColumnArticleHeader header={header} level={2} className="mb-[5rem]" />
      )}
      <div className="md:flex">
        <div className="box-border md:w-1/2">
          <ColumnArticleFragment
            modifier={headerModifier}
            content={leftColumn}
          />
        </div>
        <div className="box-border md:w-1/2">
          <ColumnArticleFragment
            modifier={headerModifier}
            content={rightColumn.content}
          />
        </div>
      </div>
      <div className="md:flex">
        <div className="box-border md:w-1/2">
          <ColumnArticleFragment
            modifier={headerModifier}
            content={final.content}
          />
        </div>
        <div className="box-border md:w-1/2">
          <div className="flex relative justify-center w-full h-full">
            <Picture
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>
    </article>
  );
};
