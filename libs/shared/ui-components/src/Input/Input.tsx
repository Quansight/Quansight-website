import { ChangeEvent, FC, InputHTMLAttributes, forwardRef } from 'react';

import clsx from 'clsx';

export type TInputProps = {
  type: string;
  onChange?: (e: ChangeEvent) => void;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input: FC<TInputProps> = forwardRef<HTMLInputElement, TInputProps>(
  ({ type = 'text', className, onChange, ...inputProps }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        onChange={onChange}
        className={clsx(
          'w-full border border-solid border-gray-100 p-[15px] text-[1.6rem] leading-[3rem] placeholder:text-black',
          className,
        )}
        {...inputProps}
      />
    );
  },
);
