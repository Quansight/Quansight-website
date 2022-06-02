import { FC } from 'react';

import Picture from '../../Picture/Picture';
import { TFooterSocialMediaProps } from '../types';

export const FooterSocialMedia: FC<TFooterSocialMediaProps> = ({
  title,
  links,
}) => (
  <div className="col-span-2 sm:col-span-1">
    <h2 className="hidden pb-[1.3rem] mb-8 text-[1.6rem] font-bold leading-[3rem] border-b-[0.5px] border-black sm:block xl:border-white">
      {title}
    </h2>
    <ul className="flex gap-12 lg:gap-8 xl:gap-12">
      {links.map(({ linkImage, linkUrl, _uid }) => (
        <li key={_uid}>
          <a
            target="_blank"
            href={linkUrl.url}
            rel="noreferrer"
            className="block relative w-10 h-10 brightness-0 lg:w-8 lg:h-8 xl:w-10 xl:h-10 xl:brightness-100"
          >
            {linkImage ? (
              <Picture
                imageSrc={linkImage.filename}
                imageAlt={linkImage.alt}
                layout="fill"
              />
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
