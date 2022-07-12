import { FC, useEffect } from 'react';

import 'highlight.js/styles/a11y-dark.css';

import hljs from 'highlight.js';

import { createMarkup } from '@quansight/shared/utils';

import { TBlogPostProps } from '../types';

export const BlogPost: FC<TBlogPostProps> = ({ postText }) => {
  useEffect(() => {
    hljs.highlightAll();
    hljs.configure({
      ignoreUnescapedHTML: true,
    });
  }, [postText]);

  return (
    <div
      className="prose-code:px-0 prose-pre:px-0 prose-img:mx-auto prose-figcaption:mt-[2rem] mb-[5rem] min-w-full text-[1.8rem] leading-[2.7rem] text-black prose-a:underline-offset-2 prose-code:bg-transparent prose-pre:bg-transparent prose-code:rounded-lg prose sm:prose-figcaption:mt-0 focus:prose-a:text-violet hover:prose-a:text-violet"
      dangerouslySetInnerHTML={createMarkup(postText)}
    />
  );
};
