import { FC } from 'react';

import { Footer } from '../Footer/Footer';
import { HeaderDesktop } from '../Header/HeaderDesktop/HeaderDesktop';
import { HeaderMobile } from '../Header/HeaderMobile/HeaderMobile';
import { TLayoutProps } from './types';

export const Layout: FC<TLayoutProps> = ({
  children,
  footer,
  header,
  variant,
}) => (
  <div>
    {header?.content && (
      <header className="fixed inset-x-0 top-0 z-20 text-white ">
        <HeaderMobile {...header.content} variant={variant} />
        <HeaderDesktop />
      </header>
    )}
    <main id="maincontent">{children}</main>
    {footer?.content && <Footer {...footer.content} />}
  </div>
);
