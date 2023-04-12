import { FC } from 'react';

import { TBlogCTAButtonProps } from './types';

export const BlogCTAButton: FC<TBlogCTAButtonProps> = ({
  text,
  url,
  target,
}) => {
  return (
    <div className="flex justify-center">
      <button
        className="bg-violet mt-6 w-fit py-2 px-8 text-[1.8rem] font-bold leading-[3.7rem] text-white"
        onClick={() => {
          window.open(url, target);
        }}
      >
        {text} &nbsp; &#9654;
      </button>
    </div>
  );
};
