/* eslint-disable @typescript-eslint/no-explicit-any */

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

import * as Types from '../../types/basic';
export type LibrarylinkItemsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type LibrarylinkItemsQuery = {
  __typename?: 'QueryType';
  LibrarylinkItems: {
    __typename?: 'LibrarylinkItems';
    total: number | null;
    items: Array<{
      __typename?: 'LibrarylinkItem';
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
      is_startpage: boolean | null;
      id: number | null;
      group_id: number | null;
      full_slug: string | null;
      first_published_at: string | null;
      default_full_slug: string | null;
      created_at: string | null;
      content: {
        __typename?: 'LibrarylinkComponent';
        type: string | null;
        publishedDate: string | null;
        postTitle: string | null;
        category: Array<string | null> | null;
        _uid: string | null;
        component: string | null;
        _editable: string | null;
        postImage: {
          __typename?: 'Asset';
          alt: string | null;
          filename: string;
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
            name: string;
            parentId: number | null;
            isFolder: boolean | null;
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
        resourceLink: {
          __typename?: 'Link';
          cachedUrl: string;
          email: string | null;
          fieldtype: string;
          id: string;
          linktype: string;
          url: string;
          story: {
            __typename?: 'Story';
            uuid: string | null;
            tagList: Array<string | null> | null;
            sortByDate: string | null;
            slug: string | null;
            releaseId: number | null;
            publishedAt: string | null;
            position: number | null;
            path: string | null;
            parentId: number | null;
            name: string | null;
            metaData: any | null;
            lang: string | null;
            isStartpage: boolean | null;
            id: number | null;
            groupId: number | null;
            fullSlug: string | null;
            firstPublishedAt: string | null;
            createdAt: string | null;
            content: any | null;
            translatedSlugs: Array<{
              __typename?: 'TranslatedSlug';
              lang: string;
              name: string | null;
              path: string | null;
            } | null> | null;
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
          } | null;
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
    } | null> | null;
  } | null;
};

export const LibrarylinkItemsDocument = gql`
  query librarylinkItems {
    LibrarylinkItems {
      items {
        content {
          type
          publishedDate
          postTitle
          postImage {
            alt
            filename
            copyright
            focus
            id
            name
            title
          }
          category
          _uid
          component
          author {
            content
            alternates {
              fullSlug
              id
              name
              parentId
              isFolder
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
          _editable
          resourceLink {
            cachedUrl
            email
            fieldtype
            id
            linktype
            url
            story {
              uuid
              translatedSlugs {
                lang
                name
                path
              }
              tagList
              sortByDate
              slug
              releaseId
              publishedAt
              position
              path
              parentId
              name
              metaData
              lang
              isStartpage
              id
              groupId
              fullSlug
              firstPublishedAt
              createdAt
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
            }
          }
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
        is_startpage
        id
        group_id
        full_slug
        first_published_at
        default_full_slug
        created_at
      }
      total
    }
  }
`;
export type LibrarylinkItemsQueryResult = Apollo.QueryResult<
  LibrarylinkItemsQuery,
  LibrarylinkItemsQueryVariables
>;
