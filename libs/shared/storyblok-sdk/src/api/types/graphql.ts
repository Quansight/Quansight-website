/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BlockScalar: any;
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: any;
  JsonScalar: any;
};

export type Alternate = {
  __typename?: 'Alternate';
  fullSlug: Scalars['String'];
  id: Scalars['Int'];
  isFolder: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  parentId: Maybe<Scalars['Int']>;
  published: Scalars['Boolean'];
  slug: Scalars['String'];
};

export type ContentItem = {
  __typename?: 'ContentItem';
  alternates: Maybe<Array<Maybe<Alternate>>>;
  content: Maybe<Scalars['JsonScalar']>;
  content_string: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['String']>;
  default_full_slug: Maybe<Scalars['String']>;
  first_published_at: Maybe<Scalars['String']>;
  full_slug: Maybe<Scalars['String']>;
  group_id: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['Int']>;
  is_startpage: Maybe<Scalars['Boolean']>;
  lang: Maybe<Scalars['String']>;
  meta_data: Maybe<Scalars['JsonScalar']>;
  name: Maybe<Scalars['String']>;
  parent_id: Maybe<Scalars['Int']>;
  path: Maybe<Scalars['String']>;
  position: Maybe<Scalars['Int']>;
  published_at: Maybe<Scalars['String']>;
  release_id: Maybe<Scalars['Int']>;
  slug: Maybe<Scalars['String']>;
  sort_by_date: Maybe<Scalars['String']>;
  tag_list: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid: Maybe<Scalars['String']>;
};

export type ContentItems = {
  __typename?: 'ContentItems';
  items: Maybe<Array<Maybe<ContentItem>>>;
  total: Maybe<Scalars['Int']>;
};

export type Datasource = {
  __typename?: 'Datasource';
  id: Scalars['Int'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type DatasourceEntries = {
  __typename?: 'DatasourceEntries';
  items: Array<DatasourceEntry>;
  total: Scalars['Int'];
};

export type DatasourceEntry = {
  __typename?: 'DatasourceEntry';
  dimensionValue: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  value: Scalars['String'];
};

export type Datasources = {
  __typename?: 'Datasources';
  items: Array<Datasource>;
};

export type FilterQueryOperations = {
  /** Must match all values of given array */
  all_in_array: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Greater than date (Exmples: 2019-03-03 or 2020-03-03T03:03:03) */
  gt_date: InputMaybe<Scalars['ISO8601DateTime']>;
  /** Greater than float value */
  gt_float: InputMaybe<Scalars['Float']>;
  /** Greater than integer value */
  gt_int: InputMaybe<Scalars['Int']>;
  /** Matches exactly one value */
  in: InputMaybe<Scalars['String']>;
  /** Matches any value of given array */
  in_array: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Matches exactly one integer value */
  in_int: InputMaybe<Scalars['Int']>;
  /** Matches exactly one value with a wildcard search using * */
  like: InputMaybe<Scalars['String']>;
  /** Less than date (Format: 2019-03-03 or 2020-03-03T03:03:03) */
  lt_date: InputMaybe<Scalars['ISO8601DateTime']>;
  /** Less than float value */
  lt_float: InputMaybe<Scalars['Float']>;
  /** Less than integer value */
  lt_int: InputMaybe<Scalars['Int']>;
  /** Matches all without the given value */
  not_in: InputMaybe<Scalars['String']>;
  /** Matches all without the given value */
  not_like: InputMaybe<Scalars['String']>;
};

export type LinkEntries = {
  __typename?: 'LinkEntries';
  items: Array<LinkEntry>;
};

export type LinkEntry = {
  __typename?: 'LinkEntry';
  id: Maybe<Scalars['Int']>;
  isFolder: Maybe<Scalars['Boolean']>;
  isStartpage: Maybe<Scalars['Boolean']>;
  name: Maybe<Scalars['String']>;
  parentId: Maybe<Scalars['Int']>;
  position: Maybe<Scalars['Int']>;
  published: Maybe<Scalars['Boolean']>;
  slug: Maybe<Scalars['String']>;
  uuid: Maybe<Scalars['String']>;
};

export type PageComponent = {
  __typename?: 'PageComponent';
  _editable: Maybe<Scalars['String']>;
  _uid: Maybe<Scalars['String']>;
  body: Maybe<Scalars['BlockScalar']>;
  component: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
};

export type PageFilterQuery = {
  description: InputMaybe<FilterQueryOperations>;
  title: InputMaybe<FilterQueryOperations>;
};

export type PageItem = {
  __typename?: 'PageItem';
  alternates: Maybe<Array<Maybe<Alternate>>>;
  content: Maybe<PageComponent>;
  created_at: Maybe<Scalars['String']>;
  default_full_slug: Maybe<Scalars['String']>;
  first_published_at: Maybe<Scalars['String']>;
  full_slug: Maybe<Scalars['String']>;
  group_id: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['Int']>;
  is_startpage: Maybe<Scalars['Boolean']>;
  lang: Maybe<Scalars['String']>;
  meta_data: Maybe<Scalars['JsonScalar']>;
  name: Maybe<Scalars['String']>;
  parent_id: Maybe<Scalars['Int']>;
  path: Maybe<Scalars['String']>;
  position: Maybe<Scalars['Int']>;
  published_at: Maybe<Scalars['String']>;
  release_id: Maybe<Scalars['Int']>;
  slug: Maybe<Scalars['String']>;
  sort_by_date: Maybe<Scalars['String']>;
  tag_list: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid: Maybe<Scalars['String']>;
};

export type PageItems = {
  __typename?: 'PageItems';
  items: Maybe<Array<Maybe<PageItem>>>;
  total: Maybe<Scalars['Int']>;
};

export type QueryType = {
  __typename?: 'QueryType';
  ContentNode: Maybe<ContentItem>;
  ContentNodes: Maybe<ContentItems>;
  DatasourceEntries: Maybe<DatasourceEntries>;
  Datasources: Maybe<Datasources>;
  Links: Maybe<LinkEntries>;
  PageItem: Maybe<PageItem>;
  PageItems: Maybe<PageItems>;
  RateLimit: Maybe<RateLimit>;
  Space: Maybe<Space>;
  Tags: Maybe<Tags>;
};

export type QueryTypeContentNodeArgs = {
  find_by: InputMaybe<Scalars['String']>;
  from_release: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  language: InputMaybe<Scalars['String']>;
  resolve_links: InputMaybe<Scalars['String']>;
  resolve_relations: InputMaybe<Scalars['String']>;
};

export type QueryTypeContentNodesArgs = {
  by_slugs: InputMaybe<Scalars['String']>;
  by_uuids: InputMaybe<Scalars['String']>;
  by_uuids_ordered: InputMaybe<Scalars['String']>;
  excluding_fields: InputMaybe<Scalars['String']>;
  excluding_ids: InputMaybe<Scalars['String']>;
  excluding_slugs: InputMaybe<Scalars['String']>;
  fallback_lang: InputMaybe<Scalars['String']>;
  filter_query: InputMaybe<Scalars['JsonScalar']>;
  first_published_at_gt: InputMaybe<Scalars['String']>;
  first_published_at_lt: InputMaybe<Scalars['String']>;
  from_release: InputMaybe<Scalars['String']>;
  is_startpage: InputMaybe<Scalars['String']>;
  language: InputMaybe<Scalars['String']>;
  page: InputMaybe<Scalars['Int']>;
  per_page: InputMaybe<Scalars['Int']>;
  published_at_gt: InputMaybe<Scalars['String']>;
  published_at_lt: InputMaybe<Scalars['String']>;
  resolve_links: InputMaybe<Scalars['String']>;
  resolve_relations: InputMaybe<Scalars['String']>;
  search_term: InputMaybe<Scalars['String']>;
  sort_by: InputMaybe<Scalars['String']>;
  starts_with: InputMaybe<Scalars['String']>;
  with_tag: InputMaybe<Scalars['String']>;
};

export type QueryTypeDatasourceEntriesArgs = {
  datasource: InputMaybe<Scalars['String']>;
  dimension: InputMaybe<Scalars['String']>;
  page: InputMaybe<Scalars['Int']>;
  per_page: InputMaybe<Scalars['Int']>;
};

export type QueryTypeDatasourcesArgs = {
  by_ids: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  search: InputMaybe<Scalars['String']>;
};

export type QueryTypeLinksArgs = {
  paginated: InputMaybe<Scalars['Boolean']>;
  starts_with: InputMaybe<Scalars['String']>;
};

export type QueryTypePageItemArgs = {
  find_by: InputMaybe<Scalars['String']>;
  from_release: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  language: InputMaybe<Scalars['String']>;
  resolve_links: InputMaybe<Scalars['String']>;
  resolve_relations: InputMaybe<Scalars['String']>;
};

export type QueryTypePageItemsArgs = {
  by_slugs: InputMaybe<Scalars['String']>;
  by_uuids: InputMaybe<Scalars['String']>;
  by_uuids_ordered: InputMaybe<Scalars['String']>;
  excluding_fields: InputMaybe<Scalars['String']>;
  excluding_ids: InputMaybe<Scalars['String']>;
  excluding_slugs: InputMaybe<Scalars['String']>;
  fallback_lang: InputMaybe<Scalars['String']>;
  filter_query: InputMaybe<Scalars['JsonScalar']>;
  filter_query_v2: InputMaybe<PageFilterQuery>;
  first_published_at_gt: InputMaybe<Scalars['String']>;
  first_published_at_lt: InputMaybe<Scalars['String']>;
  from_release: InputMaybe<Scalars['String']>;
  is_startpage: InputMaybe<Scalars['String']>;
  language: InputMaybe<Scalars['String']>;
  page: InputMaybe<Scalars['Int']>;
  per_page: InputMaybe<Scalars['Int']>;
  published_at_gt: InputMaybe<Scalars['String']>;
  published_at_lt: InputMaybe<Scalars['String']>;
  resolve_links: InputMaybe<Scalars['String']>;
  resolve_relations: InputMaybe<Scalars['String']>;
  search_term: InputMaybe<Scalars['String']>;
  sort_by: InputMaybe<Scalars['String']>;
  starts_with: InputMaybe<Scalars['String']>;
  with_tag: InputMaybe<Scalars['String']>;
};

export type QueryTypeTagsArgs = {
  starts_with: InputMaybe<Scalars['String']>;
};

export type RateLimit = {
  __typename?: 'RateLimit';
  maxCost: Scalars['Int'];
};

export type Space = {
  __typename?: 'Space';
  domain: Scalars['String'];
  id: Scalars['Int'];
  languageCodes: Array<Maybe<Scalars['String']>>;
  name: Scalars['String'];
  version: Scalars['Int'];
};

export type Tag = {
  __typename?: 'Tag';
  name: Scalars['String'];
  taggingsCount: Scalars['Int'];
};

export type Tags = {
  __typename?: 'Tags';
  items: Array<Tag>;
};

export type TranslatedSlug = {
  __typename?: 'TranslatedSlug';
  lang: Scalars['String'];
  name: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
};

export type LinksQueryVariables = Exact<{ [key: string]: never }>;

export type LinksQuery = {
  __typename?: 'QueryType';
  Links: {
    __typename?: 'LinkEntries';
    items: Array<{
      __typename?: 'LinkEntry';
      id: number | null;
      slug: string | null;
      isFolder: boolean | null;
      name: string | null;
    }>;
  } | null;
};

export type PageItemQueryVariables = Exact<{
  slug: Scalars['ID'];
}>;

export type PageItemQuery = {
  __typename?: 'QueryType';
  PageItem: {
    __typename?: 'PageItem';
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
      __typename?: 'PageComponent';
      _editable: string | null;
      _uid: string | null;
      body: any | null;
      component: string | null;
      title: string | null;
      description: string | null;
    } | null;
    translated_slugs: Array<{
      __typename?: 'TranslatedSlug';
      lang: string;
      name: string | null;
      path: string | null;
    } | null> | null;
  } | null;
};

export type PageItemsQueryVariables = Exact<{ [key: string]: never }>;

export type PageItemsQuery = {
  __typename?: 'QueryType';
  PageItems: {
    __typename?: 'PageItems';
    items: Array<{
      __typename?: 'PageItem';
      full_slug: string | null;
      first_published_at: string | null;
      is_startpage: boolean | null;
      name: string | null;
      path: string | null;
      position: number | null;
      parent_id: number | null;
      published_at: string | null;
      id: number | null;
    } | null> | null;
  } | null;
};

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
  LinksQuery,
  LinksQueryVariables
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
  PageItemQuery,
  PageItemQueryVariables
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
  PageItemsQuery,
  PageItemsQueryVariables
>;
