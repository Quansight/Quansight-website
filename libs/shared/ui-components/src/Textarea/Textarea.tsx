import { ChangeEvent, FC, InputHTMLAttributes, forwardRef } from 'react';

import clsx from 'clsx';

export type TTextareaProps = {
  onChange?: (e: ChangeEvent) => void;
  className?: string;
} & InputHTMLAttributes<HTMLTextAreaElement>;

export const Textarea: FC<TTextareaProps> = forwardRef<
  HTMLTextAreaElement,
  TTextareaProps
>(({ className, onChange, ...textareaProps }, ref) => {
  return (
    <textarea
      ref={ref}
      onChange={onChange}
      className={clsx(
        'w-full border border-solid border-gray-100 p-[15px] text-[1.6rem] leading-[3rem] placeholder:text-black',
        className,
      )}
      {...textareaProps}
    />
  );
});
