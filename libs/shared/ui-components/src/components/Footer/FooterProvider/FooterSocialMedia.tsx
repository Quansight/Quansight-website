import { FC } from 'react';
import { TFooterSocialMediaProps } from '../types';
import Picture from '../../Picture/Picture';

export const FooterSocialMedia: FC<TFooterSocialMediaProps> = ({
  title,
  links,
}) => (
  <div>
    <h2>{title}</h2>
    <ul>
      {links.map(({ linkImage, linkUrl, _uid }) => (
        <li key={_uid}>
          <a
            target="_blank"
            href={linkUrl.url}
            rel="noreferrer"
            className="block relative w-8 h-8 brightness-0"
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

export default FooterSocialMedia;
