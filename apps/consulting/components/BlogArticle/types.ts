import { TLink, TImage, TRichText } from '@quansight/shared/types';

import { TPostAuthor } from '../../types/storyblok/bloks/blogPost';
import { TTiles } from '../../types/storyblok/bloks/libraryProps';

export type TBlogMoreArticlesProps = {
  featuredPosts: TTiles;
};

export type TBlogPostProps = {
  postText: TRichText;
};

export type TBlogHeaderPostDataProps = {
  postTitle: string;
  publishedDate: string;
};

export type TBlogHeaderAuthorProps = {
  firstName: string;
  lastName: string;
  githubNick: string;
  githubLink: TLink;
  authorImage: TImage;
};

export type TBlogHeaderProps = {
  author: TPostAuthor;
} & TBlogHeaderPostDataProps;
