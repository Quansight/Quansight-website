import { FC } from 'react';

import { TFormSuccessProps } from './types';

export const FormSuccess: FC<TFormSuccessProps> = ({ thanksMessage }) => (
  <div
    className="
      relative py-[10.1rem] px-[2.2rem] mx-auto md:py-[12rem] lg:px-[13rem] xl:py-[16rem]
      max-w-layout
    "
  >
    {thanksMessage.content.map(({ type, content }) => {
      const value = content[0].text;

      if (type === 'heading') {
        return (
          <h2
            className="
              text-[4rem] font-extrabold leading-[5.9rem] text-center 
              md:text-[4.8rem] 
              text-violet font-heading
            "
          >
            {value}
          </h2>
        );
      } else {
        return (
          <p className="text-[1.8rem] leading-[2.7rem] text-center text-black">
            {value}
          </p>
        );
      }
    })}
  </div>
);
