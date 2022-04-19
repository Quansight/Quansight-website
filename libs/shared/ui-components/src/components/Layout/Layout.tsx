import { FC, ReactNode } from 'react';
import { FooterItem } from '@quansight/shared/storyblok-sdk';
import Footer from '../Footer/Footer';

export type TLayoutProps = {
  footer: FooterItem;
  children: ReactNode;
};

export const Layout: FC<TLayoutProps> = ({ footer, children }) => {
  return (
    <div>
      <main>{children}</main>
      {footer.content && <Footer {...footer.content} />}
    </div>
  );
};

export default Layout;
