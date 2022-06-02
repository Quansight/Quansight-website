import { FC, useState, useEffect, useRef } from 'react';

import clsx from 'clsx';

import { DeviceSizeVariant, useDeviceSize } from '@quansight/shared/utils';

import { THeaderDesktopDropdownProps } from '../types';
import { HeaderDesktopDropdownLink } from './HeaderDesktopDropdownLink';

export const HeaderDesktopDropdown: FC<THeaderDesktopDropdownProps> = ({
  buttonText,
  links,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const deviceSize = useDeviceSize();

  const onMouseEvent = (isDropdownOpen: boolean): void => {
    if (deviceSize !== DeviceSizeVariant.Desktop) return;
    setIsDropdownOpen(isDropdownOpen);
  };

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFocusClose = ({ target }: FocusEvent): void => {
      if (container.current && !container.current.contains(target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleClickOutside = ({ target }: MouseEvent): void => {
      if (container.current && !container.current.contains(target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('focusin', handleFocusClose);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('focusin', handleFocusClose);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    return;
  }, [isDropdownOpen]);

  return (
    <div
      ref={container}
      className="relative"
      onMouseEnter={() => onMouseEvent(true)}
      onMouseLeave={() => onMouseEvent(false)}
    >
      <button
        aria-expanded={isDropdownOpen ? 'true' : 'false'}
        aria-controls="options"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={clsx(
          isDropdownOpen ? 'text-green' : 'text-white',
          'flex justify-between items-center text-[1.7rem] font-extrabold leading-[2.825rem] capitalize font-heading',
        )}
      >
        {buttonText}
        <span
          aria-hidden="true"
          className={clsx(
            isDropdownOpen ? 'rotate-180' : 'rotate-0',
            isDropdownOpen && 'border-y-green',
            'inline-block ml-4 w-0 h-0 border-x-[0.7rem] border-t-[.7rem] border-x-transparent transition-transform motion-reduce:transition-none ease-in-out border-y-solid border-l-solid',
          )}
        />
      </button>
      {isDropdownOpen && (
        <div className="absolute top-full right-0 z-20 pt-[2.4rem]">
          <ul
            id="options"
            className="flex flex-col gap-[0.8rem] justify-between items-start p-[2.8rem] min-w-[19.8rem] text-left text-black bg-white"
          >
            {links.map((link) => (
              <HeaderDesktopDropdownLink
                key={link._uid}
                {...link}
                onDropdownClose={setIsDropdownOpen}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
