import { FC, useState, useEffect, useRef } from 'react';

import clsx from 'clsx';

import { TNavigationDropdown, LinkVariant } from '../types';
import { NavigationLink } from './NavigationLink';

export const NavigationDropdown: FC<TNavigationDropdown> = ({
  buttonText,
  links,
  isNavigationOpen,
}) => {
  const [isNavbarItemOpen, setIsNavbarItemOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore
    const handleOutsideEvent = (event): void => {
      if (container.current && !container.current.contains(event.target)) {
        setIsNavbarItemOpen(false);
      }
    };

    if (isNavbarItemOpen) {
      document.addEventListener('focusin', handleOutsideEvent);
      document.addEventListener('click', handleOutsideEvent);
      return () => {
        document.removeEventListener('focusin', handleOutsideEvent);
        document.removeEventListener('click', handleOutsideEvent);
      };
    }
    return;
  }, [isNavbarItemOpen]);

  useEffect(() => {
    setIsNavbarItemOpen(false);
  }, [isNavigationOpen]);
  return (
    <div ref={container}>
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
            'inline-block ml-4 w-0 h-0 border-x-[0.7rem] border-t-[.7rem] border-x-transparent transition-transform duration-500 ease-in-out border-y-solid border-l-solid',
          )}
        />
      </button>
      <ul
        id="options"
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
    </div>
  );
};
