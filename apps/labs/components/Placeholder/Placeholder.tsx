import React from 'react';

const Placeholder = ({ componentName }: { componentName?: string }): JSX.Element => (
  <div>
    The component
    {componentName}
    has not been created yet.
  </div>
);

export default Placeholder;
