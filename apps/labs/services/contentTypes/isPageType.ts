import { ContentType } from '@quansight/shared/types';

export const isPageType = (type = ''): boolean => type === ContentType.Page;
