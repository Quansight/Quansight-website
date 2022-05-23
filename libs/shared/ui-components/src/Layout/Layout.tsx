import { FC, ReactNode } from 'react';

import { FooterItem, HeaderItem } from '@quansight/shared/storyblok-sdk';

import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';

export type TLayoutProps = {
  children: ReactNode;
  footer: FooterItem;
  header: HeaderItem;
};

export const Layout: FC<TLayoutProps> = ({ children, footer, header }) => {
  return (
    <div>
      {header?.content && <Header {...header.content} />}

      <div className="flex justify-center items-center w-full h-screen text-white bg-[#000]">
        <button onClick={() => console.log('Hello')}>Click Me</button>
      </div>

      <main id="maincontent">{children}</main>
      {footer?.content && <Footer {...footer.content} />}
    </div>
  );
};

export default Layout;
