import { FC, useState, useEffect } from 'react';

import clsx from 'clsx';

import { LinkVariant } from '../../types';
import { THeaderMobileDropdownProps } from '../types';
import { HeaderMobileLink } from './HeaderMobileLink';

export const HeaderMobileDropdown: FC<THeaderMobileDropdownProps> = ({
  buttonText,
  links,
  isNavigationOpen,
  setIsNavigationOpen,
}) => {
  const [isNavbarItemOpen, setIsNavbarItemOpen] = useState(false);

  useEffect(() => {
    setIsNavbarItemOpen(false);
  }, [isNavigationOpen]);
  return (
    <div>
      <button
        aria-expanded={isNavbarItemOpen ? 'true' : 'false'}
        aria-controls="options"
        className="flex justify-start items-center py-[1.6rem] px-[2rem] w-full text-[1.7rem] font-extrabold leading-[2.825rem] text-left capitalize font-heading"
        onClick={() => setIsNavbarItemOpen(!isNavbarItemOpen)}
      >
        {buttonText}
        <span
          aria-hidden="true"
          className={clsx(
            isNavbarItemOpen && '-rotate-180',
            'inline-block ml-4 w-0 h-0 border-x-[0.7rem] border-t-[.7rem] border-x-transparent transition-transform motion-reduce:transition-none duration-500 ease-in-out border-y-solid border-l-solid',
          )}
        />
      </button>
      <ul
        id="options"
        className={clsx('mb-[0.7rem]', isNavbarItemOpen ? 'block' : 'hidden')}
      >
        {links.map((link) => (
          <HeaderMobileLink
            key={link._uid}
            {...link}
            variant={LinkVariant.Dropdown}
            setIsNavigationOpen={setIsNavigationOpen}
          />
        ))}
      </ul>
    </div>
  );
};
