import { FC } from 'react';

import { isValidString } from '../../utils/isValidString';
import { TErrorNotificationProps } from './types';

export const ErrorNotificatoin: FC<TErrorNotificationProps> = ({
  componentName,
}) => (
  <p className="text-red text-center text-[1.6rem]">
    {isValidString(componentName)
      ? `The component ${componentName} has not been created yet.`
      : 'Storybook data not received.'}
  </p>
);
