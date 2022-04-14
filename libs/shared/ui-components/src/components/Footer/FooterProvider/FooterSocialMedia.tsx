import { FC } from 'react';
import { TFooterSocialMediaProps } from '../types';

export const FooterSocialMedia: FC<TFooterSocialMediaProps> = ({
  title,
  links,
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        <li>
          <a target="_blank" href="https://google.com/" rel="noreferrer">
            link
          </a>
        </li>
      </ul>
    </div>
  );
};

export default FooterSocialMedia;
