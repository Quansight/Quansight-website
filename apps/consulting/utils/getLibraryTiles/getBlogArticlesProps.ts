import { PageItems } from '../../api/types/basic';
import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { formatArticleDate } from '../formatArticleDate/formatArticleDate';
import { getAuthorName } from '../getAuthorName/getAuthorName';
import { getLinkType } from './services/getLinkType';

export const getBlogArticlesProps = (blogArticles: PageItems): TTiles =>
  blogArticles.items.map((article) => {
    const blogArticleBodyItem = {
      ...article.content.body.find(
        (bodyItem) => bodyItem.component === 'blog-article',
      ),
    };
    return {
      uuid: article.uuid,
      link: getLinkType(article),
      imageSrc: blogArticleBodyItem.libraryImage.filename,
      imageAlt: blogArticleBodyItem.libraryImage.alt,
      postType: blogArticleBodyItem.type,
      postCategory: blogArticleBodyItem.category,
      title: blogArticleBodyItem.postTitle,
      author: getAuthorName(
        blogArticleBodyItem.author.content.firstName,
        blogArticleBodyItem.author.content.lastName,
      ),
      date: formatArticleDate(blogArticleBodyItem.publishedDate),
    };
  });
