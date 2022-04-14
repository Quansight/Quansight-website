import { FC } from 'react';

import { TFooterProps } from './types';

import { FooterProvider } from './FooterProvider/FooterProvider';
import { FooterCopyright } from './FooterCopyright';

export const Footer: FC<TFooterProps> = ({
  columns,
  policyAndConditions,
  copyright,
}) => (
  <footer>
    <section>
      {columns.map((column) => (
        <FooterProvider data={column} key={column._uid} />
      ))}
    </section>
    <FooterCopyright
      policyAndConditions={policyAndConditions}
      copyright={copyright}
    />
  </footer>
);

export default Footer;
