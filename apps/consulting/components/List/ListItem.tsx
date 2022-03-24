import { FC } from 'react';
import Link from 'next/link';

import { Picture } from '@quansight/shared/ui-components';

export type TListItemProps = {
  _uid?: string;
  title: string;
  text: string;
  linkTitle: string;
  linkUrl: string;
  imageSrc: string;
  imageAlt: string;
};

const ListItem: FC<TListItemProps> = ({
  title,
  text,
  linkTitle,
  linkUrl,
  imageSrc,
  imageAlt,
}) => {
  return <div>Item</div>;
};

export default ListItem;
