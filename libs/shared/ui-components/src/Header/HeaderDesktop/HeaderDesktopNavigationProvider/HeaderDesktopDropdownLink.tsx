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
      className="text-[1.7rem] font-normal leading-[2.225rem] text-left hover:underline focus:underline capitalize transition-colors motion-reduce:transition-none ease-in-out font-heading"
      onClick={onButtonClick}
    >
      {linkText}
    </button>
  );
};
