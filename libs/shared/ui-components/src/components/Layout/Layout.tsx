import { FC } from 'react';

export const Layout: FC = ({ children }) => {
  return (
    <div className="mt-10 text-5xl text-center">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
