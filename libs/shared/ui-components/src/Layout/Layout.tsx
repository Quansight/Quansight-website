import { FC } from 'react';

import { TLayoutProps } from './types';

export const Layout: FC<TLayoutProps> = ({ footer, header, children }) => {
  return (
    <div className="overflow-hidden">
      {header}
      <div className="flex justify-center items-center w-screen h-screen text-white bg-black">
        <button>Hello</button>
      </div>
      <main id="maincontent">{children}</main>
      {footer}
    </div>
  );
};

export default Layout;
