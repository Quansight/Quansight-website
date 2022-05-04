import { FC } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
// import { createMarkup } from '@quansight/shared/utils';

import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';

import { FormHeader } from './FormHeader';
import { FormImage } from './FormImage';

import { backgroundStyles } from './utils';

import { FormValues, TFormProps } from './types';

export const Form: FC<TFormProps> = ({
  hookUrl,
  title,
  imageSrc,
  imageAlt,
  errorMessage,
  thanksMessage,
}) => {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = handleSubmit((formValues): void => {
    console.log(formValues); // TODO temporary to see form values on submit
  });

  return (
    <div
      className={clsx(
        'relative py-[4.1rem] my-[6rem] mx-auto max-w-layout',
        'md:flex md:items-center md:py-[6rem]',
        'xl:py-[8rem] xl:my-[8rem]',
        backgroundStyles,
      )}
    >
      <p className="hidden">
        {hookUrl} {JSON.stringify(thanksMessage)} {errorMessage}
      </p>
      <div className="relative px-[2.2rem] md:w-1/2 lg:pl-[13rem]">
        <FormHeader title={title} />
        <form className="z-1" onSubmit={onSubmit}>
          <div className="mb-[2.5rem]">
            <Input
              type="text"
              placeholder="Enter your name"
              {...register('name')}
            />
          </div>
          <div className="mb-[2.5rem]">
            <Input
              type="email"
              placeholder="Enter your email"
              {...register('email')}
            />
          </div>
          <div className="mb-[2.5rem]">
            <Input
              type="tel"
              placeholder="Enter your phone"
              {...register('phone')}
            />
          </div>
          <div className="mb-[2.5rem]">
            <Input
              type="text"
              placeholder="Enter your company name"
              {...register('company')}
            />
          </div>
          <div className="mb-[4.2rem]">
            <Textarea
              placeholder="Enter your message"
              {...register('message')}
            />
          </div>
          <div className="flex justify-center md:justify-end lg:mr-[-3.5rem]">
            <Button
              className="py-[1.5rem] px-[5rem]"
              title="Submit"
              type="submit"
            />
          </div>
        </form>
      </div>
      <FormImage imageSrc={imageSrc} imageAlt={imageAlt} />
    </div>
  );
};
