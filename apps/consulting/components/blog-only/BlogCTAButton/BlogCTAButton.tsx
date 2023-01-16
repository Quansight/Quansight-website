import { FC } from 'react';

export type TBlogCTAButtonProps = {
  text: string; // text to display on button
  url: string; // destination URL for onClick
  target?: string; // <a> target value (e.g., _blank, _self, ...)
};

export const BlogCTAButton: FC<TBlogCTAButtonProps> = ({
  text,
  url,
  target,
}) => {
  return (
    <div className="flex justify-center">
      <button
        className="py-2 px-8 mt-6 w-fit text-[1.8rem] font-bold leading-[3.7rem] text-white bg-violet"
        onClick={() => {
          window.open(url, target);
        }}
      >
        {text} &nbsp; &#9654;
      </button>
    </div>
  );
};
