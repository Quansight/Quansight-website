import { FC } from 'react';

import clsx from 'clsx';

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
  const columnClass = 'box-border md:w-[47%]';
  const headerModifier = header ? 1 : 0;

  return (
    <article className="py-[8rem] mx-auto xl:px-[18rem] max-w-layout">
      {header && (
        <header className="mb-[2.5rem]">
          <ColumnArticleHeader header={header} level={2} />
        </header>
      )}
      <main className="md:flex md:flex-wrap md:justify-between">
        <section className={columnClass}>
          <ColumnArticleFragment
            modifier={headerModifier}
            content={leftColumn.content}
          />
        </section>
        <section className={columnClass}>
          <ColumnArticleFragment
            modifier={headerModifier}
            content={rightColumn.content}
          />
        </section>
        <section className={columnClass}>
          <ColumnArticleFragment
            modifier={headerModifier}
            content={final.content}
          />
        </section>
        <section
          className={clsx(
            columnClass,
            'md:flex md:justify-center md:items-center',
          )}
        >
          <div className="relative w-4/5 h-4/5">
            <Picture
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </section>
      </main>
    </article>
  );
};
