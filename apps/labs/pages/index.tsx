import React, { FC } from 'react';

import { Layout } from '@quansight/shared/ui-components';

export const Index: FC<TContainerProps> = () => {
  return (
    <Layout>
      <div>
        <h1>
          <span> Hello there, </span>
          Welcome labs 👋
        </h1>
      </div>
    </Layout>
  );
};

export default Index;
