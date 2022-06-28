import { FC } from 'react';

import { useRouter } from 'next/router';

import { getLinkUrl } from '../../utils/getLinkUrl';
import { THeaderDesktopDropdownLinkProps } from '../types';

export const HeaderDesktopDropdownLink: FC<THeaderDesktopDropdownLinkProps> = ({
  linkText,
  linkUrl,
  queryParams,
  onDropdownClose,
}) => {
  const router = useRouter();
  const onButtonClick = (): void => {
    onDropdownClose(false);
    router.push(getLinkUrl(queryParams, linkUrl));
  };

  return (
    <button
      className="text-[1.7rem] font-normal leading-[2.825rem] text-left capitalize transition-colors motion-reduce:transition-none ease-in-out hover:text-green font-heading focus:text-green"
      onClick={onButtonClick}
    >
      {linkText}
    </button>
  );
};
