import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export type TQconsultingItemProps = {
  title: string;
  image: {
    filename: string;
    alt: string;
  };
  link_title: string;
  link: {
    cached_url: string;
  };
};

export const QconsultingItem: FC<TQconsultingItemProps> = ({
  title,
  image: { filename, alt },
  link_title,
  link: { cached_url },
}) => {
  return (
    <div>
      <h3>{title}</h3>
      <div className="relative w-10 h-10">
        <Image src={filename} alt={alt} layout="fill" />
      </div>
      <Link href={`/${cached_url}`}>
        <a>{link_title}</a>
      </Link>
    </div>
  );
};
