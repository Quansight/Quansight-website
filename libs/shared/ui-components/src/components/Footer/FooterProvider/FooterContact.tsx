import { FC } from 'react';
import { TFooterContactProps } from '../types';
import { createMarkup } from '../../../utils';
import Link from 'next/link';

export const FooterContact: FC<TFooterContactProps> = ({
  title,
  contact,
  buttonText,
  buttonLink,
}) => (
  <div>
    <h2>{title}</h2>
    <div dangerouslySetInnerHTML={createMarkup(contact)} />
    <Link href={`/${buttonLink.cached_url}`}>
      <a>{buttonText}</a>
    </Link>
  </div>
);

export default FooterContact;
