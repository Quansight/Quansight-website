import { FC } from 'react';

import clsx from 'clsx';
import { useRouter } from 'next/router';

import { LinkVariant } from '../../types';
import { THeaderMobileLinkProps } from '../types';

export const HeaderMobileLink: FC<THeaderMobileLinkProps> = ({
  linkText,
  linkUrl,
  queryParams,
  variant = LinkVariant.Navigation,
  setIsNavigationOpen,
}) => {
  const router = useRouter();

  const onLinkClick = (): void => {
    const url = queryParams
      ? `/${linkUrl.cached_url}${queryParams}`
      : `/${linkUrl.cached_url}`;
    router.push(url);
    setIsNavigationOpen(false);
  };
  return (
    <button
      onClick={onLinkClick}
      className={clsx(
        'inline-block px-[2rem] w-full text-[1.7rem] leading-[2.825rem] text-left capitalize font-heading',
        variant === LinkVariant.Dropdown
          ? 'font-normal'
          : 'py-[1.6rem] font-extrabold',
      )}
    >
      {linkText}
    </button>
  );
};
