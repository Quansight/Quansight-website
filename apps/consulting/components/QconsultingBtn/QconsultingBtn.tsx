import Link from 'next/link';
import { FC } from 'react';

export type TQconsultingBtnProps = {
  link_title: string;
  link: {
    cached_url: string;
  };
};

export const QconsultingBtn: FC<TQconsultingBtnProps> = ({
  link_title,
  link: { cached_url },
}) => {
  return (
    <div>
      <Link href={`/${cached_url}`}>
        <a>{link_title}</a>
      </Link>
    </div>
  );
};
