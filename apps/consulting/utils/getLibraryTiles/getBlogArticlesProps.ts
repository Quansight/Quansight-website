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

    /* blogArticleBodyItem.author could be a Promise */
    let author = '';
    let author_obj = blogArticleBodyItem.author;
    if (typeof author_obj === 'object' && typeof author_obj.then === 'function') {
      let promise_author = {author: ''};
      author_obj.then( auth => promise_author.author = getAuthorName(auth.content.firstName, auth.content.lastName) );
      author = promise_author.author
    } else {
      author = getAuthorName(author_obj.content.firstName, author_obj.content.lastName);
    };

    return {
      uuid: article.uuid,
      link: getLinkType(article),
      imageSrc: blogArticleBodyItem.libraryImage.filename,
      imageAlt: blogArticleBodyItem.libraryImage.alt,
      postType: blogArticleBodyItem.type,
      postCategory: blogArticleBodyItem.category,
      title: blogArticleBodyItem.postTitle,
      author: author,
      date: formatArticleDate(blogArticleBodyItem.publishedDate),
    };
  });
