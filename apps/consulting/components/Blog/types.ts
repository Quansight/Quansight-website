import { TLink, TImage, TRichText } from '@quansight/shared/types';

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

export type TBlogHeaderProps = TBlogHeaderAuthorProps &
  TBlogHeaderPostDataProps;
