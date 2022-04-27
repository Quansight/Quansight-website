import { FC } from 'react';
import { useForm } from 'react-hook-form';
// import { createMarkup } from '@quansight/shared/utils';

import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';

import { FormHeader } from './FormHeader';
import { FormImage } from './FormImage';

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
    <div className="before:hidden relative before:absolute before:top-0 before:left-[calc(50%+10rem)] py-[6rem] px-[2rem] mx-auto before:w-[10rem] before:h-[6rem] before:content-[''] before:bg-gray-200 md:before:block md:px-[4rem] max-w-layout">
      <FormHeader title={title} />
      <p>{errorMessage}</p>
      <p>{JSON.stringify(thanksMessage)}</p>
      <p>{hookUrl}</p>
      <div className="flex flex-col-reverse md:flex-row">
        <div className="basis-1/2">
          <form onSubmit={onSubmit}>
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
            <div className="flex justify-center md:justify-end">
              <Button title="Submit" type="submit" />
            </div>
          </form>
        </div>
        <FormImage imageSrc={imageSrc} imageAlt={imageAlt} />
      </div>
    </div>
  );
};
