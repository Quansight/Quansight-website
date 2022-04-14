import { FC } from 'react';
import { TFooterCopyrightProps } from './types';
import Link from 'next/link';

export const FooterCopyright: FC<TFooterCopyrightProps> = ({
  policyAndConditions,
  copyright,
}) => {
  return (
    <section>
      <nav>
        {policyAndConditions.map(
          ({ linkText, linkUrl: { cached_url }, _uid }) => (
            <Link key={_uid} href={`/${cached_url}`}>
              <a>{linkText}</a>
            </Link>
          ),
        )}
      </nav>
      <p>{copyright}</p>
    </section>
  );
};

export default FooterCopyright;
