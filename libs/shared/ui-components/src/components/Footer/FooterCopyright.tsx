import { FC } from 'react';
import { TFooterCopyrightProps } from './types';
import Link from 'next/link';

export const FooterCopyright: FC<TFooterCopyrightProps> = ({
  policyAndConditions,
  copyright,
}) => (
  <section>
    <nav>
      {policyAndConditions.map(({ linkText, linkUrl, _uid }) => (
        <Link href={`/${linkUrl.cached_url}`} key={_uid}>
          <a>{linkText}</a>
        </Link>
      ))}
    </nav>
    <p>{copyright}</p>
  </section>
);

export default FooterCopyright;
