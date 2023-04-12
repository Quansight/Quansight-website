import { FC } from 'react';

import Picture from '../../Picture/Picture';
import { TFooterLinkProps } from '../types';
import { FooterLinkWrapper } from './FooterLinkWrapper';

export const FooterLink: FC<TFooterLinkProps> = ({
  linkUrl,
  queryString,
  linkText,
  linkImage,
  ...props
}) => {
  const isTextPresent = linkText;
  const isIconPreset = linkImage?.filename && linkImage?.alt;

  return (
    <FooterLinkWrapper linkUrl={linkUrl} queryString={queryString} {...props}>
      {isTextPresent ? (
        isIconPreset ? (
          <span className="relative block h-10 w-10 brightness-0 lg:h-8 lg:w-8 xl:h-10 xl:w-10 xl:brightness-100">
            <span className="sr-only">{linkText}</span>
            <Picture
              aria-hidden={true}
              imageSrc={linkImage.filename}
              imageAlt={linkImage.alt}
              layout="fill"
              objectFit="contain"
            />
          </span>
        ) : (
          linkText
        )
      ) : (
        'Missing Link Text'
      )}
    </FooterLinkWrapper>
  );
};
