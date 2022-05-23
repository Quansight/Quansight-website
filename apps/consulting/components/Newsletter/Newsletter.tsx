import { FC, useState } from 'react';

import { useForm } from 'react-hook-form';

import { sendFormData, SubscriberValues } from '@quansight/shared/utils';

import { NewsletterButton } from './NewsletterButton';
import { NewsletterHeader } from './NewsletterHeader';
import { NewsletterMessage } from './NewsletterMessage';

const hookUrl = process.env.NEXT_PUBLIC_NEWSLETTER_HOOK;

export const Newsletter: FC = () => {
  const { register, handleSubmit } = useForm<SubscriberValues>();
  const [isSubscribed, setSubscribed] = useState(false);

  const onSubscribe = handleSubmit((subscriberData: SubscriberValues): void => {
    sendFormData(hookUrl, subscriberData)
      .then(() => setSubscribed(true))
      .catch(() => setSubscribed(false));
  });

  return (
    <section
      className="
        box-border py-[3rem] px-[1rem] my-[3rem]
        md:py-[4rem] md:px-[10rem] md:my-[5rem]
        max-w-layout bg-violet
      "
    >
      <NewsletterHeader text="Stay informed with our newsletter" />
      <form className="md:flex md:gap-[2.6rem]" onSubmit={onSubscribe}>
        <div className="relative md:grow">
          <input
            className="
              p-[1.5rem] w-full text-[1.4rem] placeholder:text-[1.4rem]
              text-black md:text-[1.6rem]
              md:placeholder:text-[1.6rem] placeholder:text-grey
            "
            type="email"
            placeholder="Work email*"
            {...register('email', { required: true })}
          />
          {isSubscribed && (
            <NewsletterMessage message="Thanks for subscribing" />
          )}
        </div>
        <NewsletterButton cta="Subscribe" />
      </form>
    </section>
  );
};
