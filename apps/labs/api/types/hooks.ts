/* eslint-disable @typescript-eslint/no-explicit-any */

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

import * as Types from './operations';

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
