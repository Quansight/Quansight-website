import { FC } from 'react';
import { TIntertwinedArticleItemProps } from './types';
import { Picture, createMarkup } from '@quansight/shared/ui-components';

export const IntertwinedArticleItem: FC<TIntertwinedArticleItemProps> = ({
  text,
  imageSrc,
  imageAlt,
}) => {
  return (
    <section>
      <div dangerouslySetInnerHTML={createMarkup(text)} />
      <Picture imageSrc={imageSrc} imageAlt={imageAlt} layout="fill" />
    </section>
  );
};
