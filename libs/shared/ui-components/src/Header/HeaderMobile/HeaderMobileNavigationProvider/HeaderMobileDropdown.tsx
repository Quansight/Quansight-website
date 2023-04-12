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
        className="font-heading flex w-full items-center justify-start py-[1.6rem] px-[2rem] text-left text-[1.7rem] font-extrabold capitalize leading-[2.825rem]"
        onClick={() => setIsNavbarItemOpen(!isNavbarItemOpen)}
      >
        {buttonText}
        <span
          aria-hidden="true"
          className={clsx(
            isNavbarItemOpen && '-rotate-180',
            'border-y-solid border-l-solid ml-4 inline-block h-0 w-0 border-x-[0.7rem] border-t-[.7rem] border-x-transparent transition-transform duration-500 ease-in-out motion-reduce:transition-none',
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
            linkVariant={LinkVariant.Dropdown}
            setIsNavigationOpen={setIsNavigationOpen}
          />
        ))}
      </ul>
    </div>
  );
};
