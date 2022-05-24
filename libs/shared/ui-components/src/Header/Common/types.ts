import { Maybe } from '@quansight/shared/storyblok-sdk';
import { DomainVariant } from '@quansight/shared/types';

export type THeaderLogoProps = {
  imageSrc: string;
  imageAlt: string;
};

export type THeaderSkipLinksProps = {
  skipLinksText: Maybe<string>;
};

export enum LinkVariant {
  Navigation = 'navigation',
  Dropdown = 'dropdown',
}

export type TVariant = { variant: DomainVariant };
