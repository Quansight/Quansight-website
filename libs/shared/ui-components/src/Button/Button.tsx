import clsx from 'clsx';
import { ButtonHTMLAttributes, FC, MouseEventHandler } from 'react';

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
        'py-4 px-12 w-fit text-[1.6rem] font-bold leading-[3.7rem] text-white bg-violet',
        className,
      )}
    >
      {title}
    </button>
  );
};
