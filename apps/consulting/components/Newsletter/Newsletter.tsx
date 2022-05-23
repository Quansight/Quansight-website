import { FC, useState } from 'react';

import { useForm } from 'react-hook-form';

import { FormStates } from '@quansight/shared/ui-components';
import { sendFormData, SubscriberValues } from '@quansight/shared/utils';

import { NewsletterButton } from './NewsletterButton';
import { NewsletterHeader } from './NewsletterHeader';
import { NewsletterMessage } from './NewsletterMessage';
import { NewsletterStates } from './types';

const hookUrl = process.env.NEXT_PUBLIC_NEWSLETTER_HOOK;

export const Newsletter: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<SubscriberValues>();
  const [newsletterState, setNewsletterState] = useState<NewsletterStates>(
    NewsletterStates.Default,
  );

  const newsletterMessage = errors.email
    ? 'Enter a valid e-mail'
    : newsletterState === NewsletterStates.Subscribed
    ? 'Thanks for subscribing'
    : newsletterState === NewsletterStates.Error
    ? 'An error occured'
    : null;
  const onSubscribe = handleSubmit((subscriberData: SubscriberValues): void => {
    sendFormData(hookUrl, subscriberData)
      .then(() => setNewsletterState(NewsletterStates.Subscribed))
      .catch(() => setNewsletterState(NewsletterStates.Error));
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
            disabled={newsletterState === NewsletterStates.Subscribed && true}
            {...register('email', { required: true })}
          />
          <NewsletterMessage message={newsletterMessage} />
        </div>
        <NewsletterButton
          cta="Subscribe"
          isSubscribed={newsletterState === NewsletterStates.Subscribed}
        />
      </form>
    </section>
  );
};
