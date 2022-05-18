import { FC } from 'react';

import { TNavigationDropdown } from '../types';
import { NavigationLink } from './NavigationLink';

export const NavigationDropdown: FC<TNavigationDropdown> = ({
  buttonText,
  links,
}) => {
  return (
    <div>
      <button>{buttonText}</button>
      <ul>
        {links.map((link) => (
          <li key={link._uid}>
            <NavigationLink {...link} />
          </li>
        ))}
      </ul>
    </div>
  );
};
