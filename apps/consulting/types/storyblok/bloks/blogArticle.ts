import { TBlok, TRichText, TLink, TImage } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';

type TAuthor = {
  content: {
    firstName: string;
    lastName: string;
    githubNick: string;
    githubLink: TLink;
    image: TImage;
  };
};

export type TBlogArticleRawData = {
  component: ComponentType.BlogArticle;
  postText: TRichText;
  postTitle: string;
  publishedDate: string;
  category: string[];
  type: string;
  author: TAuthor;
} & TBlok;
