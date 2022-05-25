import { LinkEntry } from '@quansight/shared/storyblok-sdk';

export type TLinkEntry = Pick<LinkEntry, 'id' | 'isFolder' | 'name' | 'slug'>;
