import { FC, useState } from 'react';

import axios from 'axios';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';
import { FormError } from './FormError';
import { FormHeader } from './FormHeader';
import { FormImage } from './FormImage';
import { FormSuccess } from './FormSuccess';
import { FormValues, TFormProps } from './types';

const backgroundStyles = `
  before:absolute before:top-0 before:left-0 before:z-0 before:w-full before:h-full before:bg-lightgray
  md:before:w-2/3
`;

export const Form: FC<TFormProps> = ({
  hookUrl,
  title,
  imageSrc,
  imageAlt,
  errorMessage,
  thanksMessage,
}) => {
  const [isSuccess, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isValid },
  } = useForm<FormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = handleSubmit((formValues): void => {
    if (isValid) {
      axios
        .post<FormValues>(hookUrl, formValues)
        .then(() => console.log('success'))
        .catch((err) => console.log(err));
      setSuccess(true);
      console.log(formValues); // TODO temporary to see form values on submit
    }
  });

  if (isSuccess) {
    return <FormSuccess thanksMessage={thanksMessage} />;
  } else {
    return (
      <div
        className={clsx(
          'relative py-[4.1rem] my-[6rem] mx-auto max-w-layout',
          'md:flex md:items-center md:py-[6rem]',
          'xl:py-[8rem] xl:my-[8rem]',
          backgroundStyles,
        )}
      >
        <div className="relative px-[2.2rem] md:w-1/2 lg:pl-[13rem]">
          <FormHeader title={isSubmitted ? errorMessage : title} />
          <form className="z-1" onSubmit={onSubmit}>
            <div className="mb-[2.5rem]">
              <Input
                type="text"
                placeholder="Enter your name"
                {...register('name', { required: true })}
              />
              {errors.name && <FormError />}
            </div>
            <div className="mb-[2.5rem]">
              <Input
                type="email"
                placeholder="Enter your email"
                {...register('email', { required: true })}
              />
              {errors.email && <FormError />}
            </div>
            <div className="mb-[2.5rem]">
              <Input
                type="tel"
                placeholder="Enter your phone"
                {...register('phone', { required: true })}
              />
              {errors.phone && <FormError />}
            </div>
            <div className="mb-[2.5rem]">
              <Input
                type="text"
                placeholder="Enter your company name"
                {...register('company', { required: true })}
              />
              {errors.company && <FormError />}
            </div>
            <div className="mb-[4.2rem]">
              <Textarea
                placeholder="Enter your message"
                {...register('message', { required: true })}
              />
              {errors.message && <FormError />}
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
  }
};
