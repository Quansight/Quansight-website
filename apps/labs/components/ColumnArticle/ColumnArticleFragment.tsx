import { FC } from 'react';

// import { ColumnArticleHeader } from './ColumnArticleHeader';
// import { ColumnArticleParagraph } from './ColumnArticleParagraph';
import { TColumnArticleFragmentProps } from './types';

export const ColumnArticleFragment: FC<TColumnArticleFragmentProps> = ({
  modifier,
  content,
}) => {
  return (
    <div>
      <p>{JSON.stringify(content)}</p>
      <p>{JSON.stringify(modifier)}</p>
    </div>
  );
  // content.map((item) => {
  //   return <p>{item}</p>
  //   const value = content[0].text;

  //   if (type === 'heading') {
  //     return (
  //       <ColumnArticleHeader
  //         header={value}
  //         level={header ? 3 : 2}
  //       />
  //     )
  //   } else {

  //   }

  //   return <ColumnArticleParagraph text={value} />
  // })
};
