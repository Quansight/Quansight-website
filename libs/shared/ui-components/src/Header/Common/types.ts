import { Maybe } from '@quansight/shared/storyblok-sdk';

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
