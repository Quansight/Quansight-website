/* eslint-disable @typescript-eslint/no-explicit-any */

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

import * as Types from '../../types/basic';
export type ArticleItemsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type ArticleItemsQuery = {
  __typename?: 'QueryType';
  ArticleItems: {
    __typename?: 'ArticleItems';
    total: number | null;
    items: Array<{
      __typename?: 'ArticleItem';
      created_at: string | null;
      default_full_slug: string | null;
      first_published_at: string | null;
      full_slug: string | null;
      group_id: number | null;
      id: number | null;
      is_startpage: boolean | null;
      lang: string | null;
      meta_data: any | null;
      name: string | null;
      parent_id: number | null;
      path: string | null;
      position: number | null;
      published_at: string | null;
      release_id: number | null;
      slug: string | null;
      sort_by_date: string | null;
      tag_list: Array<string | null> | null;
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
      content: {
        __typename?: 'ArticleComponent';
        _editable: string | null;
        _uid: string | null;
        category: Array<string | null> | null;
        component: string | null;
        description: string | null;
        postTitle: string | null;
        publishedDate: string | null;
        title: string | null;
        type: string | null;
        postText: any | null;
        author: {
          __typename?: 'Story';
          content: any | null;
          createdAt: string | null;
          firstPublishedAt: string | null;
          fullSlug: string | null;
          groupId: number | null;
          isStartpage: boolean | null;
          id: number | null;
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
        postImage: {
          __typename?: 'Asset';
          alt: string | null;
          copyright: string | null;
          filename: string;
          focus: string | null;
          id: number | null;
          name: string | null;
          title: string | null;
        } | null;
      } | null;
      translated_slugs: Array<{
        __typename?: 'TranslatedSlug';
        lang: string;
        name: string | null;
        path: string | null;
      } | null> | null;
    } | null> | null;
  } | null;
};

export const ArticleItemsDocument = gql`
  query articleItems {
    ArticleItems {
      total
      items {
        alternates {
          fullSlug
          id
          isFolder
          name
          parentId
          published
          slug
        }
        content {
          _editable
          _uid
          author {
            alternates {
              fullSlug
              id
              isFolder
              name
              parentId
              published
              slug
            }
            content
            createdAt
            firstPublishedAt
            fullSlug
            groupId
            isStartpage
            id
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
          component
          description
          postImage {
            alt
            copyright
            filename
            focus
            id
            name
            title
          }
          postTitle
          publishedDate
          title
          type
          postText
        }
        created_at
        default_full_slug
        first_published_at
        full_slug
        group_id
        id
        is_startpage
        lang
        meta_data
        name
        parent_id
        path
        position
        published_at
        release_id
        slug
        sort_by_date
        tag_list
        translated_slugs {
          lang
          name
          path
        }
        uuid
      }
    }
  }
`;
export type ArticleItemsQueryResult = Apollo.QueryResult<
  ArticleItemsQuery,
  ArticleItemsQueryVariables
>;
