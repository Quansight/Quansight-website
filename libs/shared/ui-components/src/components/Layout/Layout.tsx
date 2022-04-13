import { FC, ReactNode } from 'react';
import { LayoutItem } from '@quansight/shared/storyblok-sdk';
import { TBlok } from '@quansight/shared/types';

export type TLayoutProps = {
  layout: LayoutItem;
  children: ReactNode;
};

export const Layout: FC<TLayoutProps> = ({ layout, children }) => {
  const footerProps = layout?.content?.body.find(
    (item: TBlok) => item.component === 'footer',
  );

  console.log(footerProps);

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
