/* eslint-disable @typescript-eslint/no-explicit-any */

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

import * as Types from '../../types/basic';
export type ArticleItemQueryVariables = Types.Exact<{
  slug: Types.Scalars['ID'];
}>;

export type ArticleItemQuery = {
  __typename?: 'QueryType';
  ArticleItem: {
    __typename?: 'ArticleItem';
    created_at: string | null;
    default_full_slug: string | null;
    first_published_at: string | null;
    full_slug: string | null;
    group_id: number | null;
    id: number | null;
    is_startpage: boolean | null;
    uuid: string | null;
    tag_list: Array<string | null> | null;
    sort_by_date: string | null;
    slug: string | null;
    release_id: number | null;
    published_at: string | null;
    position: number | null;
    path: string | null;
    parent_id: number | null;
    name: string | null;
    meta_data: any | null;
    lang: string | null;
    content: {
      __typename?: 'ArticleComponent';
      _editable: string | null;
      _uid: string | null;
      component: string | null;
      description: string | null;
      postText: any | null;
      postTitle: string | null;
      publishedDate: string | null;
      title: string | null;
      type: string | null;
      category: Array<string | null> | null;
      postImage: {
        __typename?: 'Asset';
        filename: string;
        alt: string | null;
        copyright: string | null;
        focus: string | null;
        id: number | null;
        name: string | null;
        title: string | null;
      } | null;
      author: {
        __typename?: 'Story';
        content: any | null;
        createdAt: string | null;
        firstPublishedAt: string | null;
        fullSlug: string | null;
        groupId: number | null;
        id: number | null;
        isStartpage: boolean | null;
        lang: string | null;
        metaData: any | null;
        name: string | null;
        parentId: number | null;
        path: string | null;
        position: number | null;
        publishedAt: string | null;
        releaseId: number | null;
        slug: string | null;
        sortByDate: string | null;
        tagList: Array<string | null> | null;
        uuid: string | null;
        alternates: Array<{
          __typename?: 'Alternate';
          fullSlug: string;
          id: number;
          isFolder: boolean | null;
          name: string;
          parentId: number | null;
          published: boolean;
          slug: string;
        } | null> | null;
        translatedSlugs: Array<{
          __typename?: 'TranslatedSlug';
          lang: string;
          name: string | null;
          path: string | null;
        } | null> | null;
      } | null;
    } | null;
    alternates: Array<{
      __typename?: 'Alternate';
      fullSlug: string;
      id: number;
      isFolder: boolean | null;
      name: string;
      parentId: number | null;
      published: boolean;
      slug: string;
    } | null> | null;
    translated_slugs: Array<{
      __typename?: 'TranslatedSlug';
      lang: string;
      name: string | null;
      path: string | null;
    } | null> | null;
  } | null;
};

export const ArticleItemDocument = gql`
  query articleItem($slug: ID!) {
    ArticleItem(id: $slug) {
      content {
        _editable
        _uid
        component
        description
        postText
        postTitle
        postImage {
          filename
          alt
          copyright
          focus
          id
          name
          title
        }
        publishedDate
        title
        type
        author {
          content
          alternates {
            fullSlug
            id
            isFolder
            name
            parentId
            published
            slug
          }
          createdAt
          firstPublishedAt
          fullSlug
          groupId
          id
          isStartpage
          lang
          metaData
          name
          parentId
          path
          position
          publishedAt
          releaseId
          slug
          sortByDate
          tagList
          translatedSlugs {
            lang
            name
            path
          }
          uuid
        }
        category
      }
      alternates {
        fullSlug
        id
        isFolder
        name
        parentId
        published
        slug
      }
      created_at
      default_full_slug
      first_published_at
      full_slug
      group_id
      id
      is_startpage
      uuid
      translated_slugs {
        lang
        name
        path
      }
      tag_list
      sort_by_date
      slug
      release_id
      published_at
      position
      path
      parent_id
      name
      meta_data
      lang
    }
  }
`;
export type ArticleItemQueryResult = Apollo.QueryResult<
  ArticleItemQuery,
  ArticleItemQueryVariables
>;
