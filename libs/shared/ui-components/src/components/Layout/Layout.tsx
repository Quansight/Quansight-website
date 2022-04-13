import { FC } from 'react';

export const Layout: FC = ({ children }) => {
  return (
    <div className="overflow-hidden">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
