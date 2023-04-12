import { FC } from 'react';

import { TFormSuccessProps } from './types';

export const FormSuccess: FC<TFormSuccessProps> = ({ thanksMessage }) => (
  <div
    className="
      max-w-layout relative mx-auto py-[10.1rem] px-[2.2rem] md:py-[12rem] lg:px-[13rem]
      xl:py-[16rem]
    "
  >
    {thanksMessage.content.map(({ type, content }) => {
      const value = content[0].text;

      if (type === 'heading') {
        return (
          <h2
            key={value}
            className="
              text-violet font-heading text-center text-[4rem] 
              font-extrabold 
              leading-[5.9rem] md:text-[4.8rem]
            "
          >
            {value}
          </h2>
        );
      } else {
        return (
          <p
            key={value}
            className="text-center text-[1.8rem] leading-[2.7rem] text-black"
          >
            {value}
          </p>
        );
      }
    })}
  </div>
);
