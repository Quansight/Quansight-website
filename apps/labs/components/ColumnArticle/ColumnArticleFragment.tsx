import { FC } from 'react';

import { ColumnArticleHeader } from './ColumnArticleHeader';
import { ColumnArticleParagraph } from './ColumnArticleParagraph';
import { TColumnArticleFragmentProps } from './types';

export const ColumnArticleFragment: FC<TColumnArticleFragmentProps> = ({
  modifier,
  content,
}) => (
  <div>
    {content.map((item) => {
      const text = item.content[0].text;

      if (item.type === 'heading') {
        return (
          <ColumnArticleHeader
            key={text}
            level={item.attrs.level + modifier}
            header={text}
          />
        );
      }

      return <ColumnArticleParagraph key={text} text={text} />;
    })}
  </div>
);
