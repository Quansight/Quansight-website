/* eslint-disable @typescript-eslint/no-explicit-any */

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

import * as Types from './operations';

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
  Types.ArticleItemQuery,
  Types.ArticleItemQueryVariables
>;
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
  Types.ArticleItemsQuery,
  Types.ArticleItemsQueryVariables
>;
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
  Types.LibrarylinkItemsQuery,
  Types.LibrarylinkItemsQueryVariables
>;
export const FooterItemDocument = gql`
  query FooterItem($slug: ID!) {
    FooterItem(id: $slug) {
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
        columns
        component
        copyright
        policyAndConditions
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
`;
export type FooterItemQueryResult = Apollo.QueryResult<
  Types.FooterItemQuery,
  Types.FooterItemQueryVariables
>;
export const LinksDocument = gql`
  query links {
    Links {
      items {
        id
        slug
        isFolder
        name
      }
    }
  }
`;
export type LinksQueryResult = Apollo.QueryResult<
  Types.LinksQuery,
  Types.LinksQueryVariables
>;
export const PageItemDocument = gql`
  query pageItem($slug: ID!) {
    PageItem(id: $slug) {
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
        body
        component
        title
        description
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
`;
export type PageItemQueryResult = Apollo.QueryResult<
  Types.PageItemQuery,
  Types.PageItemQueryVariables
>;
export const PageItemsDocument = gql`
  query pageItems {
    PageItems(per_page: 100) {
      items {
        full_slug
        first_published_at
        is_startpage
        name
        path
        position
        parent_id
        published_at
        id
      }
    }
  }
`;
export type PageItemsQueryResult = Apollo.QueryResult<
  Types.PageItemsQuery,
  Types.PageItemsQueryVariables
>;
export const TeamDocument = gql`
  query Team {
    PersonItems(starts_with: "team-members/", sort_by: "position") {
      items {
        id
        position
        content {
          _uid
          firstName
          lastName
          displayName
          role
          image {
            filename
            alt
          }
          projects
          githubNick
        }
      }
    }
  }
`;
export type TeamQueryResult = Apollo.QueryResult<
  Types.TeamQuery,
  Types.TeamQueryVariables
>;
export const TeamMemberDocument = gql`
  query TeamMember($slug: ID!) {
    PersonItem(id: $slug) {
      slug
      id
      content {
        firstName
        lastName
        displayName
        role
        image {
          filename
          alt
        }
        githubNick
      }
    }
  }
`;
export type TeamMemberQueryResult = Apollo.QueryResult<
  Types.TeamMemberQuery,
  Types.TeamMemberQueryVariables
>;
