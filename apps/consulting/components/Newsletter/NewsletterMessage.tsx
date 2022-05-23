import { FC } from 'react';

import { TNewsletterMessageProps } from './types';

export const NewsletterMessage: FC<TNewsletterMessageProps> = ({ message }) => (
  <p>{message}</p>
);
