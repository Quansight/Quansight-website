import { FC, useState } from 'react';

import clsx from 'clsx';
import { useForm } from 'react-hook-form';

import {
  sendFormData,
  FormValues,
  TrackingParams,
  FormAndTrackingValues,
} from '@quansight/shared/utils';
import { BOOK_A_CALL_FORM_ID } from '@quansight/shared/utils';

import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';
import { FormError } from './FormError';
import { FormHeader } from './FormHeader';
import { FormImage } from './FormImage';
import { FormSuccess } from './FormSuccess';
import { FormStates, TFormProps } from './types';
import { getFormHeader, getTrackingParams } from './utils';

export const backgroundStyles = `
  before:absolute before:top-0 before:left-0 before:z-0 before:w-full before:h-full before:bg-gray-50
  md:before:w-2/3
`;

export const Form: FC<TFormProps> = (props) => {
  const { hookUrl, imageSrc, imageAlt, thanksMessage } = props;
  const [formStatus, setFormStatus] = useState<FormStates>(FormStates.Default);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: 'onChange' });

  const checkErrors = (): void => {
    if (!isValid) setFormStatus(FormStates.Errors);
  };

  const onSubmit = handleSubmit((formValues): void => {
    const trackingParams: TrackingParams = getTrackingParams();
    const combinedValues: FormAndTrackingValues = {
      ...formValues,
      ...trackingParams,
      form_url: window.location.toString(),
    };

    sendFormData(hookUrl, combinedValues)
      .then(() => setFormStatus(FormStates.Success))
      .catch(() => setFormStatus(FormStates.Failure));
  });

  if (formStatus === FormStates.Success)
    return <FormSuccess thanksMessage={thanksMessage} />;

  return (
    <div
      id={BOOK_A_CALL_FORM_ID}
      className={clsx(
        'max-w-layout relative my-[6rem] mx-auto py-[4.1rem]',
        'md:flex md:items-center md:py-[6rem]',
        'xl:my-[8rem] xl:py-[8rem]',
        backgroundStyles,
      )}
    >
      <div className="relative px-[2.2rem] md:w-1/2 lg:pl-[13rem]">
        <FormHeader title={getFormHeader(props, formStatus)} />
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
              onClick={checkErrors}
            />
          </div>
        </form>
      </div>
      <FormImage imageSrc={imageSrc} imageAlt={imageAlt} />
    </div>
  );
};
