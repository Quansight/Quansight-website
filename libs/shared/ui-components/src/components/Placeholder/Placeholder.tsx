import { FC } from 'react';
import { TPlaceholderProps } from './types';

export const Placeholder: FC<TPlaceholderProps> = ({ componentName }) => (
  <div>
    The component
    {` ${componentName} `}
    has not been created yet.
  </div>
);

export default Placeholder;
