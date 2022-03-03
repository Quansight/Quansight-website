import { ContentType } from '../../types/storyblok/contentTypes';

export const isPageType = (type = ''): boolean => type === ContentType.Page;
