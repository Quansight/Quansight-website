import { FooterItem, HeaderItem } from '../../../api/types/basic';
import { TPost } from './blogPost';
import { TTiles } from './libraryProps';

export type TLibraryArticleProps = {
  post: TPost;
  header: HeaderItem;
  footer: FooterItem;
  featuredPosts: TTiles;
  preview: boolean;
};
