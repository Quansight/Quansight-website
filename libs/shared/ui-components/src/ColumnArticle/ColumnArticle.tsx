import { FC } from 'react';

import clsx from 'clsx';

import { Picture } from '../Picture/Picture';
import { ColumnArticleHeader } from './ColumnArticleHeader';
import { ColumnArticleSection } from './ColumnArticleSection';
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
  const headerLevelModifier = header ? 1 : 0;

  return (
    <article className="max-w-layout mx-auto px-[2.2rem] py-[8rem] sm:px-[4.3rem] xl:px-[18rem]">
      {header && (
        <header className="mb-[2.5rem]">
          <ColumnArticleHeader header={header} level={2} />
        </header>
      )}
      <div className="flex flex-wrap justify-between">
        <section className={clsx(columnClass, 'order-1')}>
          <ColumnArticleSection
            headerLevelModifier={headerLevelModifier}
            content={leftColumn?.content}
          />
        </section>
        <section className={clsx(columnClass, 'order-4 md:order-2')}>
          <ColumnArticleSection
            headerLevelModifier={headerLevelModifier}
            content={rightColumn?.content}
          />
        </section>
        <section className={clsx(columnClass, 'order-3')}>
          <ColumnArticleSection
            headerLevelModifier={headerLevelModifier}
            content={final?.content}
          />
        </section>
        <section
          className={clsx(
            columnClass,
            'order-2 flex w-[100%] items-center justify-center md:order-4',
          )}
        >
          <div className="relative h-4/5 min-h-[240px] w-4/5">
            <Picture
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </section>
      </div>
    </article>
  );
};
