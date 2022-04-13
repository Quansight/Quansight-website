import { FC, ReactNode } from 'react';
import { LayoutItem } from '@quansight/shared/storyblok-sdk';
import { getPropsByName } from './utils/getPropsByName';
import Footer from '../Footer/Footer';

export type TLayoutProps = {
  layout: LayoutItem;
  children: ReactNode;
};

export const Layout: FC<TLayoutProps> = ({ layout, children }) => {
  const footerProps = getPropsByName(layout?.content?.body, 'footer');
  return (
    <div>
      <main>{children}</main>
      {footerProps && <Footer {...footerProps} />}
    </div>
  );
};

export default Layout;
