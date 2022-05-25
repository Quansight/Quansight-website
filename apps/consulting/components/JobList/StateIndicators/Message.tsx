import { FC } from 'react';

type TMessage = {
  message: string;
};

export const Message: FC<TMessage> = ({ message }) => (
  <p
    role="alert"
    className="text-[2rem] font-normal leading-[3rem] text-center text-black sm:text-[3rem]"
  >
    {message}
  </p>
);
