import { ContentType } from '@quansight/shared/config';

export const isPageType = (type = ''): boolean => type === ContentType.Page;
