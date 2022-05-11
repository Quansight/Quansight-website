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

export type ArticleComponent = {
  __typename?: 'ArticleComponent';
  _editable: Maybe<Scalars['String']>;
  _uid: Maybe<Scalars['String']>;
  author: Maybe<Story>;
  category: Maybe<Array<Maybe<Scalars['String']>>>;
  component: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  postImage: Maybe<Asset>;
  postText: Maybe<Scalars['JsonScalar']>;
  postTitle: Maybe<Scalars['String']>;
  publishedDate: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  type: Maybe<Scalars['String']>;
};

export type ArticleComponentAuthorArgs = {
  fields: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  language: InputMaybe<Scalars['String']>;
  resolve_relations: InputMaybe<Scalars['String']>;
};

export type ArticleFilterQuery = {
  author: InputMaybe<FilterQueryOperations>;
  category: InputMaybe<FilterQueryOperations>;
  postTitle: InputMaybe<FilterQueryOperations>;
  title: InputMaybe<FilterQueryOperations>;
  type: InputMaybe<FilterQueryOperations>;
};

export type ArticleItem = {
  __typename?: 'ArticleItem';
  alternates: Maybe<Array<Maybe<Alternate>>>;
  content: Maybe<ArticleComponent>;
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

export type ArticleItems = {
  __typename?: 'ArticleItems';
  items: Maybe<Array<Maybe<ArticleItem>>>;
  total: Maybe<Scalars['Int']>;
};

export type Asset = {
  __typename?: 'Asset';
  alt: Maybe<Scalars['String']>;
  copyright: Maybe<Scalars['String']>;
  filename: Scalars['String'];
  focus: Maybe<Scalars['String']>;
  id: Maybe<Scalars['Int']>;
  name: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
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

export type FooterComponent = {
  __typename?: 'FooterComponent';
  _editable: Maybe<Scalars['String']>;
  _uid: Maybe<Scalars['String']>;
  columns: Maybe<Scalars['BlockScalar']>;
  component: Maybe<Scalars['String']>;
  copyright: Maybe<Scalars['String']>;
  policyAndConditions: Maybe<Scalars['BlockScalar']>;
};

export type FooterItem = {
  __typename?: 'FooterItem';
  alternates: Maybe<Array<Maybe<Alternate>>>;
  content: Maybe<FooterComponent>;
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

export type FooterItems = {
  __typename?: 'FooterItems';
  items: Maybe<Array<Maybe<FooterItem>>>;
  total: Maybe<Scalars['Int']>;
};

export type LibrarylinkComponent = {
  __typename?: 'LibrarylinkComponent';
  _editable: Maybe<Scalars['String']>;
  _uid: Maybe<Scalars['String']>;
  author: Maybe<Story>;
  category: Maybe<Array<Maybe<Scalars['String']>>>;
  component: Maybe<Scalars['String']>;
  postImage: Maybe<Asset>;
  postTitle: Maybe<Scalars['String']>;
  publishedDate: Maybe<Scalars['String']>;
  resourceLink: Maybe<Link>;
  type: Maybe<Scalars['String']>;
};

export type LibrarylinkComponentAuthorArgs = {
  fields: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  language: InputMaybe<Scalars['String']>;
  resolve_relations: InputMaybe<Scalars['String']>;
};

export type LibrarylinkFilterQuery = {
  author: InputMaybe<FilterQueryOperations>;
  category: InputMaybe<FilterQueryOperations>;
  postTitle: InputMaybe<FilterQueryOperations>;
  type: InputMaybe<FilterQueryOperations>;
};

export type LibrarylinkItem = {
  __typename?: 'LibrarylinkItem';
  alternates: Maybe<Array<Maybe<Alternate>>>;
  content: Maybe<LibrarylinkComponent>;
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

export type LibrarylinkItems = {
  __typename?: 'LibrarylinkItems';
  items: Maybe<Array<Maybe<LibrarylinkItem>>>;
  total: Maybe<Scalars['Int']>;
};

export type Link = {
  __typename?: 'Link';
  cachedUrl: Scalars['String'];
  email: Maybe<Scalars['String']>;
  fieldtype: Scalars['String'];
  id: Scalars['String'];
  linktype: Scalars['String'];
  story: Maybe<Story>;
  url: Scalars['String'];
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

export type PersonComponent = {
  __typename?: 'PersonComponent';
  _editable: Maybe<Scalars['String']>;
  _uid: Maybe<Scalars['String']>;
  component: Maybe<Scalars['String']>;
  firstName: Maybe<Scalars['String']>;
  githubLink: Maybe<Link>;
  githubNick: Maybe<Scalars['String']>;
  image: Maybe<Asset>;
  lastName: Maybe<Scalars['String']>;
  role: Maybe<Scalars['String']>;
};

export type PersonFilterQuery = {
  firstName: InputMaybe<FilterQueryOperations>;
  githubNick: InputMaybe<FilterQueryOperations>;
  lastName: InputMaybe<FilterQueryOperations>;
  role: InputMaybe<FilterQueryOperations>;
};

export type PersonItem = {
  __typename?: 'PersonItem';
  alternates: Maybe<Array<Maybe<Alternate>>>;
  content: Maybe<PersonComponent>;
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

export type PersonItems = {
  __typename?: 'PersonItems';
  items: Maybe<Array<Maybe<PersonItem>>>;
  total: Maybe<Scalars['Int']>;
};

export type QueryType = {
  __typename?: 'QueryType';
  ArticleItem: Maybe<ArticleItem>;
  ArticleItems: Maybe<ArticleItems>;
  ContentNode: Maybe<ContentItem>;
  ContentNodes: Maybe<ContentItems>;
  DatasourceEntries: Maybe<DatasourceEntries>;
  Datasources: Maybe<Datasources>;
  FooterItem: Maybe<FooterItem>;
  FooterItems: Maybe<FooterItems>;
  LibrarylinkItem: Maybe<LibrarylinkItem>;
  LibrarylinkItems: Maybe<LibrarylinkItems>;
  Links: Maybe<LinkEntries>;
  PageItem: Maybe<PageItem>;
  PageItems: Maybe<PageItems>;
  PersonItem: Maybe<PersonItem>;
  PersonItems: Maybe<PersonItems>;
  RateLimit: Maybe<RateLimit>;
  Space: Maybe<Space>;
  Tags: Maybe<Tags>;
};

export type QueryTypeArticleItemArgs = {
  find_by: InputMaybe<Scalars['String']>;
  from_release: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  language: InputMaybe<Scalars['String']>;
  resolve_links: InputMaybe<Scalars['String']>;
  resolve_relations: InputMaybe<Scalars['String']>;
};

export type QueryTypeArticleItemsArgs = {
  by_slugs: InputMaybe<Scalars['String']>;
  by_uuids: InputMaybe<Scalars['String']>;
  by_uuids_ordered: InputMaybe<Scalars['String']>;
  excluding_fields: InputMaybe<Scalars['String']>;
  excluding_ids: InputMaybe<Scalars['String']>;
  excluding_slugs: InputMaybe<Scalars['String']>;
  fallback_lang: InputMaybe<Scalars['String']>;
  filter_query: InputMaybe<Scalars['JsonScalar']>;
  filter_query_v2: InputMaybe<ArticleFilterQuery>;
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

export type QueryTypeFooterItemArgs = {
  find_by: InputMaybe<Scalars['String']>;
  from_release: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  language: InputMaybe<Scalars['String']>;
  resolve_links: InputMaybe<Scalars['String']>;
  resolve_relations: InputMaybe<Scalars['String']>;
};

export type QueryTypeFooterItemsArgs = {
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

export type QueryTypeLibrarylinkItemArgs = {
  find_by: InputMaybe<Scalars['String']>;
  from_release: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  language: InputMaybe<Scalars['String']>;
  resolve_links: InputMaybe<Scalars['String']>;
  resolve_relations: InputMaybe<Scalars['String']>;
};

export type QueryTypeLibrarylinkItemsArgs = {
  by_slugs: InputMaybe<Scalars['String']>;
  by_uuids: InputMaybe<Scalars['String']>;
  by_uuids_ordered: InputMaybe<Scalars['String']>;
  excluding_fields: InputMaybe<Scalars['String']>;
  excluding_ids: InputMaybe<Scalars['String']>;
  excluding_slugs: InputMaybe<Scalars['String']>;
  fallback_lang: InputMaybe<Scalars['String']>;
  filter_query: InputMaybe<Scalars['JsonScalar']>;
  filter_query_v2: InputMaybe<LibrarylinkFilterQuery>;
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

export type QueryTypePersonItemArgs = {
  find_by: InputMaybe<Scalars['String']>;
  from_release: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  language: InputMaybe<Scalars['String']>;
  resolve_links: InputMaybe<Scalars['String']>;
  resolve_relations: InputMaybe<Scalars['String']>;
};

export type QueryTypePersonItemsArgs = {
  by_slugs: InputMaybe<Scalars['String']>;
  by_uuids: InputMaybe<Scalars['String']>;
  by_uuids_ordered: InputMaybe<Scalars['String']>;
  excluding_fields: InputMaybe<Scalars['String']>;
  excluding_ids: InputMaybe<Scalars['String']>;
  excluding_slugs: InputMaybe<Scalars['String']>;
  fallback_lang: InputMaybe<Scalars['String']>;
  filter_query: InputMaybe<Scalars['JsonScalar']>;
  filter_query_v2: InputMaybe<PersonFilterQuery>;
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

export type Story = {
  __typename?: 'Story';
  alternates: Maybe<Array<Maybe<Alternate>>>;
  content: Maybe<Scalars['JsonScalar']>;
  createdAt: Maybe<Scalars['String']>;
  firstPublishedAt: Maybe<Scalars['String']>;
  fullSlug: Maybe<Scalars['String']>;
  groupId: Maybe<Scalars['Int']>;
  id: Maybe<Scalars['Int']>;
  isStartpage: Maybe<Scalars['Boolean']>;
  lang: Maybe<Scalars['String']>;
  metaData: Maybe<Scalars['JsonScalar']>;
  name: Maybe<Scalars['String']>;
  parentId: Maybe<Scalars['Int']>;
  path: Maybe<Scalars['String']>;
  position: Maybe<Scalars['Int']>;
  publishedAt: Maybe<Scalars['String']>;
  releaseId: Maybe<Scalars['Int']>;
  slug: Maybe<Scalars['String']>;
  sortByDate: Maybe<Scalars['String']>;
  tagList: Maybe<Array<Maybe<Scalars['String']>>>;
  translatedSlugs: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid: Maybe<Scalars['String']>;
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

export type ArticleItemQueryVariables = Exact<{
  slug: Scalars['ID'];
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

export type ArticleItemsQueryVariables = Exact<{ [key: string]: never }>;

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

export type FooterItemQueryVariables = Exact<{
  slug: Scalars['ID'];
}>;

export type FooterItemQuery = {
  __typename?: 'QueryType';
  FooterItem: {
    __typename?: 'FooterItem';
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
      __typename?: 'FooterComponent';
      _editable: string | null;
      _uid: string | null;
      columns: any | null;
      component: string | null;
      copyright: string | null;
      policyAndConditions: any | null;
    } | null;
    translated_slugs: Array<{
      __typename?: 'TranslatedSlug';
      lang: string;
      name: string | null;
      path: string | null;
    } | null> | null;
  } | null;
};

export type LibrarylinkItemsQueryVariables = Exact<{ [key: string]: never }>;

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

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never }>;

export type Unnamed_1_Query = {
  __typename?: 'QueryType';
  PersonItems: {
    __typename?: 'PersonItems';
    items: Array<{
      __typename?: 'PersonItem';
      id: number | null;
      position: number | null;
      content: {
        __typename?: 'PersonComponent';
        _uid: string | null;
        firstName: string | null;
        role: string | null;
      } | null;
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
  FooterItemQuery,
  FooterItemQueryVariables
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
  LibrarylinkItemsQuery,
  LibrarylinkItemsQueryVariables
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
export const Document = gql`
  {
    PersonItems(starts_with: "team/", sort_by: "position") {
      items {
        id
        position
        content {
          _uid
          firstName
          role
        }
      }
    }
  }
`;
export type QueryResult = Apollo.QueryResult<Query, QueryVariables>;
