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
        'p-[15px] w-full text-[1.6rem] leading-[3rem] placeholder:text-black border border-gray-100 border-solid',
        className,
      )}
      {...textareaProps}
    />
  );
});
