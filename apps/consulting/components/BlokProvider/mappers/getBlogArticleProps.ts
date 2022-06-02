import { TBlogArticleRawData } from '../../../types/storyblok/bloks/blogArticle';
import { TBlogArticleProps } from '../../BlogArticle/types';

export const getBlogArticleProps = (
  blok: TBlogArticleRawData,
): TBlogArticleProps => {
  const firstName = blok?.author?.content?.firstName || null;
  const lastName = blok?.author?.content?.lastName || null;
  const githubNick = blok?.author?.content?.githubNick || null;
  const githubLink = blok?.author?.content?.githubLink || null;
  const authorImage = blok?.author?.content?.image || null;
  const isAuthorDatePresent = (firstName || lastName) && authorImage;

  const author = {
    firstName,
    lastName,
    githubNick,
    githubLink,
    authorImage,
  };
  return {
    postTitle: blok.postTitle,
    publishedDate: blok.publishedDate,
    postText: blok.postText,
    author: isAuthorDatePresent ? { ...author } : null,
  };
};
