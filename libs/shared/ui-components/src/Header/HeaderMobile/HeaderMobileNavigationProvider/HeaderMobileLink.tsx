import { FC } from 'react';

import clsx from 'clsx';
import { useRouter } from 'next/router';

import { LinkVariant } from '../../types';
import { getLinkUrl } from '../../utils/getLinkUrl';
import { THeaderMobileLinkProps } from '../types';

export const HeaderMobileLink: FC<THeaderMobileLinkProps> = ({
  linkText,
  linkUrl,
  queryParams,
  linkVariant = LinkVariant.Navigation,
  setIsNavigationOpen,
}) => {
  const router = useRouter();

  const onLinkClick = (): void => {
    router.push(getLinkUrl(queryParams, linkUrl));
    setIsNavigationOpen(false);
  };

  return (
    <button
      onClick={onLinkClick}
      className={clsx(
        'font-heading inline-block w-full px-[2rem] text-left text-[1.7rem] capitalize leading-[2.825rem]',
        linkVariant === LinkVariant.Dropdown
          ? 'font-normal'
          : 'py-[1.6rem] font-extrabold',
      )}
    >
      {linkText}
    </button>
  );
};
