import { FC } from 'react';

import { ColumnArticleHeader } from './ColumnArticleHeader';
import { TColumnArticleSectionProps } from './types';

export const ColumnArticleSection: FC<TColumnArticleSectionProps> = ({
  headerLevelModifier,
  content = [],
}) => (
  <>
    {content.map((item) => {
      console.log('ITEM', item);
      // if (Array.isArray(item.content)) {
      //   const firstItem = item?.content[0];
      //   const itemLevel = item?.attrs?.level || 0;
      //   if (firstItem?.text) {
      //     const text = firstItem?.text;
      //     if (item.type === 'heading') {
      //       return (
      //         <ColumnArticleHeader
      //           key={text}
      //           level={itemLevel + headerLevelModifier}
      //           header={text}
      //         />
      //       );
      //     }

      //     return (
      //       <p
      //         key={text}
      //         className="my-[3rem] text-[1.6rem] leading-[2.7rem] text-black"
      //       >
      //         {text}
      //       </p>
      //     );
      //   }
      // }
      return null;
    })}
  </>
);
