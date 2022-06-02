/* eslint-disable @typescript-eslint/no-explicit-any */

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

import * as Types from './operations';

export const DatasourceEntriesDocument = gql`
  query datasourceEntries($slug: String!) {
    DatasourceEntries(datasource: $slug) {
      items {
        name
        id
        value
        dimensionValue
      }
      total
    }
  }
`;
export type DatasourceEntriesQueryResult = Apollo.QueryResult<
  Types.DatasourceEntriesQuery,
  Types.DatasourceEntriesQueryVariables
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
export const PageItemsDocument = gql`
  query PageItems($relations: String, $prefix: String) {
    PageItems(resolve_relations: $relations, starts_with: $prefix) {
      items {
        content {
          _uid
          title
          description
          component
          body
          _editable
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
      total
    }
  }
`;
export type PageItemsQueryResult = Apollo.QueryResult<
  Types.PageItemsQuery,
  Types.PageItemsQueryVariables
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
export const HeaderItemDocument = gql`
  query HeaderItem($slug: ID!) {
    HeaderItem(id: $slug) {
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
      content {
        _editable
        _uid
        component
        navigation
        skipLinksText
        logo {
          focus
          alt
          copyright
          filename
          id
          name
          title
        }
        bookACallLinkText
      }
    }
  }
`;
export type HeaderItemQueryResult = Apollo.QueryResult<
  Types.HeaderItemQuery,
  Types.HeaderItemQueryVariables
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
  query pageItem($slug: ID!, $relations: String) {
    PageItem(id: $slug, resolve_relations: $relations) {
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
export const TeamDocument = gql`
  query Team {
    PersonItems(
      starts_with: "team-members/"
      sort_by: "position"
      per_page: 100
    ) {
      items {
        id
        position
        slug
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
