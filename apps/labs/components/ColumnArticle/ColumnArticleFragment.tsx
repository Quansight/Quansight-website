import { FC } from 'react';

import { ColumnArticleHeader } from './ColumnArticleHeader';
import { TColumnArticleFragmentProps } from './types';

export const ColumnArticleFragment: FC<TColumnArticleFragmentProps> = ({
  modifier,
  content,
}) => (
  <>
    {content.map((item) => {
      const text = item.content[0].text;

      if (item.type === 'heading')
        return (
          <ColumnArticleHeader
            key={text}
            level={item.attrs.level + modifier}
            header={text}
          />
        );

      return (
        <p
          key={text}
          className="my-[3rem] text-[1.6rem] leading-[2.7rem] text-black"
        >
          {text}
        </p>
      );
    })}
  </>
);
