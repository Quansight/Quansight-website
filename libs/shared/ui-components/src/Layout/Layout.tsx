import { FC } from 'react';

import { TLayoutProps } from './types';

export const Layout: FC<TLayoutProps> = ({ footer, header, children }) => {
  return (
    <div>
      {header}
      <main id="maincontent">{children}</main>
      {footer}
    </div>
  );
};

export default Layout;
