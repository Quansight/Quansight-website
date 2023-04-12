import { ButtonHTMLAttributes, FC, MouseEventHandler } from 'react';

import clsx from 'clsx';

export type TButtonProps = {
  title: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<TButtonProps> = ({
  title,
  onClick,
  className,
  ...buttonProps
}) => {
  return (
    <button
      {...buttonProps}
      onClick={onClick}
      className={clsx(
        'bg-violet w-fit py-4 px-12 text-[1.6rem] font-bold leading-[3.7rem] text-white',
        className,
      )}
    >
      {title}
    </button>
  );
};
