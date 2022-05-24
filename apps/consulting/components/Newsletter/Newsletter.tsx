import { FC, useState } from 'react';

import clsx from 'clsx';
import { useForm } from 'react-hook-form';

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

  const subscribeNewsletter = handleSubmit(
    (subscriberData: SubscriberValues): void => {
      sendFormData(hookUrl, subscriberData)
        .then(() => setNewsletterState(NewsletterStates.Subscribed))
        .catch(() => setNewsletterState(NewsletterStates.Error));
    },
  );

  const newsletterMessage = errors.email
    ? 'Enter a valid e-mail'
    : newsletterState === NewsletterStates.Subscribed
    ? 'Thanks for subscribing'
    : newsletterState === NewsletterStates.Error
    ? 'An error occured'
    : null;

  return (
    <section
      className={clsx(
        'box-border py-[3rem] px-[1rem] my-[3rem] max-w-layout bg-violet',
        'md:py-[4rem] md:px-[10rem] md:my-[5rem]',
      )}
    >
      <NewsletterHeader text="Stay informed with our newsletter" />
      <form className="md:flex md:gap-[2.6rem]" onSubmit={subscribeNewsletter}>
        <div className="relative md:grow">
          <input
            className={clsx(
              'p-[1.5rem] w-full text-[1.4rem] text-black',
              'placeholder:text-[1.4rem] placeholder:text-grey',
              'md:text-[1.6rem] md:placeholder:text-[1.6rem]',
            )}
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
