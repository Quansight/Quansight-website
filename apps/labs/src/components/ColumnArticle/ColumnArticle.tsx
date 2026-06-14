import type { FC } from 'react';

import clsx from 'clsx';

import { Picture } from '../Picture';
import { ColumnArticleHeader } from './ColumnArticleHeader';
import { md } from '../../utils/markdown';

type ColumnArticleProps = {
  header?: string;
  image: string;
  imageAlt: string;
  leftColumn?: string;
  rightColumn?: string;
  final?: string;
};

const ColumnSection: FC<{ content?: string }> = ({ content }) => {
  if (!content) return null;
  return (
    <div
      className="my-[3rem] text-[1.6rem] leading-[2.7rem] text-black prose max-w-none"
      dangerouslySetInnerHTML={md(content)}
    />
  );
};

export const ColumnArticle: FC<ColumnArticleProps> = ({
  header,
  image,
  imageAlt,
  leftColumn,
  rightColumn,
  final,
}) => {
  const columnClass = 'box-border md:w-[47%]';

  return (
    <article className="py-[8rem] px-[2.2rem] mx-auto sm:px-[4.3rem] xl:px-[18rem] max-w-layout">
      {header && (
        <header className="mb-[2.5rem]">
          <ColumnArticleHeader header={header} level={2} />
        </header>
      )}
      <div className="flex flex-wrap justify-between">
        <section className={clsx(columnClass, 'order-1')}>
          <ColumnSection content={leftColumn} />
        </section>
        <section className={clsx(columnClass, 'order-4 md:order-2')}>
          <ColumnSection content={rightColumn} />
        </section>
        <section className={clsx(columnClass, 'order-3')}>
          <ColumnSection content={final} />
        </section>
        <section
          className={clsx(
            columnClass,
            'flex order-2 justify-center items-center w-[100%] md:order-4',
          )}
        >
          <div className="relative w-4/5 h-4/5 min-h-[240px]">
            <Picture src={image} alt={imageAlt} layout="fill" objectFit="contain" />
          </div>
        </section>
      </div>
    </article>
  );
};
