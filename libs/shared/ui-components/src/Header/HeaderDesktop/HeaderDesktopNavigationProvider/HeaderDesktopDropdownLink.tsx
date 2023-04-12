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
      className="font-heading text-left text-[1.7rem] font-normal capitalize leading-[2.225rem] transition-colors ease-in-out hover:underline focus:underline motion-reduce:transition-none"
      onClick={onButtonClick}
    >
      {linkText}
    </button>
  );
};
