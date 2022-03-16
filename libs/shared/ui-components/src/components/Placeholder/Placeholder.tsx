import { FC } from 'react';

type TPlaceholderProps = {
  componentName: string;
};

export const Placeholder: FC<TPlaceholderProps> = ({ componentName }) => (
  <div>
    The component
    {` ${componentName} `}
    has not been created yet.
  </div>
);

export default Placeholder;
