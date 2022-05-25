import { FC, ReactNode } from 'react';

export type TLayoutProps = {
  children: ReactNode;
  footer: ReactNode;
};

export const Layout: FC<TLayoutProps> = ({ footer, children }) => {
  return (
    <div>
      <main>{children}</main>
      {footer}
    </div>
  );
};

export default Layout;
