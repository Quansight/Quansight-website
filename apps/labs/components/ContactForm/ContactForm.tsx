import {
  Button,
  Input,
  Picture,
  Textarea,
} from '@quansight/shared/ui-components';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

export type FormValues = {
  firstName: string;
  email?: string;
  phone?: string;
  companyName?: string;
  message: string;
};

export type TContactFormProps = {
  title: string;
};

export const ContactForm: FC<TContactFormProps> = ({ title }) => {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = handleSubmit((formValues): void => {
    console.log(formValues); // TODO temporary to see form values on submit
  });

  return (
    <div className="before:hidden relative before:absolute before:top-0 before:left-[calc(50%+10rem)] py-[6rem] px-[2rem] before:w-[10rem] before:h-[6rem] before:content-[''] before:bg-gray-200 md:before:block md:px-[4rem]">
      <h2 className="mb-[4rem] text-[4rem] font-extrabold leading-[4.9rem] text-center md:mb-[17rem] md:text-[4.8rem] md:text-left text-violet font-heading">
        {title}
      </h2>

      <div className="flex flex-col-reverse md:flex-row">
        <div className="basis-1/2">
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
                {...register('message')}
              />
            </div>
            <div className="flex justify-center md:justify-end">
              <Button title="Send" type="submit" />
            </div>
          </form>
        </div>

        <div className="flex basis-1/2 justify-center self-center mb-[8rem] md:self-start md:pl-[4rem] md:mb-0 lg:pl-0">
          <Picture
            imageSrc="/contactForm/contact.svg"
            imageAlt="say hello image"
            width={377}
            height={337}
          />
        </div>
      </div>
    </div>
  );
};
