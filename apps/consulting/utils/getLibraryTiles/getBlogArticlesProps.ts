import { PageItems } from '../../api/types/basic';
import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { formatArticleDate } from '../formatArticleDate/formatArticleDate';
import { getAuthorName } from '../getAuthorName/getAuthorName';
import { getLinkType } from './services/getLinkType';

export const getBlogArticlesProps = (blogArticles: PageItems): TTiles =>
  blogArticles.items
    .map((article) => ({
      uuid: article.uuid,
      link: getLinkType(article),
      tileData: {
        ...article.content.body.find(
          (bodyItem) => bodyItem.component === 'blog-article',
        ),
      },
    }))
    .map((parsedItem) => ({
      uuid: parsedItem.uuid,
      link: parsedItem.link,
      imageSrc: parsedItem.tileData.libraryImage.filename,
      imageAlt: parsedItem.tileData.libraryImage.alt,
      postType: parsedItem.tileData.type,
      postCategory: parsedItem.tileData.category,
      title: parsedItem.tileData.postTitle,
      author: getAuthorName(
        parsedItem.tileData.author.content.firstName,
        parsedItem.tileData.author.content.lastName,
      ),
      date: formatArticleDate(parsedItem.tileData.publishedDate),
    }));
