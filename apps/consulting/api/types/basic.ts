/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type HeaderComponent = {
  __typename?: 'HeaderComponent';
  _editable: Maybe<Scalars['String']>;
  _uid: Maybe<Scalars['String']>;
  bookACallLinkText: Maybe<Scalars['String']>;
  component: Maybe<Scalars['String']>;
  logo: Maybe<Asset>;
  navigation: Maybe<Scalars['BlockScalar']>;
  skipLinksText: Maybe<Scalars['String']>;
};

export type HeaderFilterQuery = {
  bookACallLinkText: InputMaybe<FilterQueryOperations>;
  skipLinksText: InputMaybe<FilterQueryOperations>;
};

export type HeaderItem = {
  __typename?: 'HeaderItem';
  alternates: Maybe<Array<Maybe<Alternate>>>;
  content: Maybe<HeaderComponent>;
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

export type HeaderItems = {
  __typename?: 'HeaderItems';
  items: Maybe<Array<Maybe<HeaderItem>>>;
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
  displayName: Maybe<Scalars['String']>;
  firstName: Maybe<Scalars['String']>;
  githubLink: Maybe<Link>;
  githubNick: Maybe<Scalars['String']>;
  image: Maybe<Asset>;
  lastName: Maybe<Scalars['String']>;
  projects: Maybe<Scalars['BlockScalar']>;
  role: Maybe<Scalars['String']>;
};

export type PersonFilterQuery = {
  displayName: InputMaybe<FilterQueryOperations>;
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
  ContentNode: Maybe<ContentItem>;
  ContentNodes: Maybe<ContentItems>;
  DatasourceEntries: Maybe<DatasourceEntries>;
  Datasources: Maybe<Datasources>;
  FooterItem: Maybe<FooterItem>;
  FooterItems: Maybe<FooterItems>;
  HeaderItem: Maybe<HeaderItem>;
  HeaderItems: Maybe<HeaderItems>;
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

export type QueryTypeHeaderItemArgs = {
  find_by: InputMaybe<Scalars['String']>;
  from_release: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  language: InputMaybe<Scalars['String']>;
  resolve_links: InputMaybe<Scalars['String']>;
  resolve_relations: InputMaybe<Scalars['String']>;
};

export type QueryTypeHeaderItemsArgs = {
  by_slugs: InputMaybe<Scalars['String']>;
  by_uuids: InputMaybe<Scalars['String']>;
  by_uuids_ordered: InputMaybe<Scalars['String']>;
  excluding_fields: InputMaybe<Scalars['String']>;
  excluding_ids: InputMaybe<Scalars['String']>;
  excluding_slugs: InputMaybe<Scalars['String']>;
  fallback_lang: InputMaybe<Scalars['String']>;
  filter_query: InputMaybe<Scalars['JsonScalar']>;
  filter_query_v2: InputMaybe<HeaderFilterQuery>;
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
