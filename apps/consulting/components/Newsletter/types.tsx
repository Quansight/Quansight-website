export enum NewsletterStates {
  Subscribed = 'subscribed',
  Error = 'error',
  Default = 'default',
}

export type TNewsletterButtonProps = {
  cta: string;
  isSubscribed: boolean;
};

export type TNewsletterHeaderProps = {
  text: string;
};

export type TNewsletterMessageProps = {
  message: string;
};
