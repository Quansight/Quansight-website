import { Button, Input, Textarea } from '@quansight/shared/ui-components';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

export type FormValues = {
  firstName: string;
  email?: string;
  phone?: string;
  companyName?: string;
  message: string;
};

export const ContactForm: FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = handleSubmit((formValues): void => {
    console.log(formValues); // TODO temporary to see form values on submit
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-[2.5rem]">
        <Input
          type="text"
          placeholder="Enter your name"
          {...register('firstName')}
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
          {...register('companyName')}
        />
      </div>
      <div className="mb-[4.2rem]">
        <Textarea
          placeholder="Enter your message"
          {...register('message', {
            maxLength: {
              value: 200,
              message: 'Message field error message',
            },
          })}
        />
      </div>
      <div className="flex justify-end">
        <Button title="Send" type="submit" />
      </div>
    </form>
  );
};
