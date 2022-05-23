import { FC, useState } from 'react';

import clsx from 'clsx';

import { TNavigationDropdown, LinkVariant } from '../types';
import { NavigationLink } from './NavigationLink';

export const NavigationDropdown: FC<TNavigationDropdown> = ({
  buttonText,
  links,
}) => {
  const [isNavbarItemOpen, setIsNavbarItemOpen] = useState(false);
  return (
    <>
      <button
        className="flex justify-start items-center py-[1.6rem] px-[2rem] w-full text-[1.7rem] font-extrabold leading-[2.825rem] text-left capitalize font-heading"
        onClick={() => setIsNavbarItemOpen(!isNavbarItemOpen)}
      >
        {buttonText}
        <span
          className={clsx(
            isNavbarItemOpen && 'rotate-180',
            'inline-block ml-4 w-0 h-0 border-x-[0.7rem] border-t-[.7rem] border-x-transparent border-y-solid border-l-solid',
          )}
        />
      </button>
      <ul
        className={clsx('mb-[0.7rem]', isNavbarItemOpen ? 'block' : 'hidden')}
      >
        {links.map((link) => (
          <NavigationLink
            key={link._uid}
            {...link}
            variant={LinkVariant.Dropdown}
          />
        ))}
      </ul>
    </>
  );
};
