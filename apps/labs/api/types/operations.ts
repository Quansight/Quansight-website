/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Types from './basic';

export type FooterItemQueryVariables = Types.Exact<{
  slug: Types.Scalars['ID'];
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

export type HeaderItemQueryVariables = Types.Exact<{
  slug: Types.Scalars['ID'];
}>;

export type HeaderItemQuery = {
  __typename?: 'QueryType';
  HeaderItem: {
    __typename?: 'HeaderItem';
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
    translated_slugs: Array<{
      __typename?: 'TranslatedSlug';
      lang: string;
      name: string | null;
      path: string | null;
    } | null> | null;
    content: {
      __typename?: 'HeaderComponent';
      _editable: string | null;
      _uid: string | null;
      component: string | null;
      navigation: any | null;
      skipLinksText: string | null;
      bookACallLinkText: string | null;
      logo: {
        __typename?: 'Asset';
        focus: string | null;
        alt: string | null;
        copyright: string | null;
        filename: string;
        id: number | null;
        name: string | null;
        title: string | null;
      } | null;
    } | null;
  } | null;
};

export type LinksQueryVariables = Types.Exact<{ [key: string]: never }>;

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

export type PageItemQueryVariables = Types.Exact<{
  slug: Types.Scalars['ID'];
  relations: Types.InputMaybe<Types.Scalars['String']>;
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

export type PageItemsQueryVariables = Types.Exact<{ [key: string]: never }>;

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

export type TeamQueryVariables = Types.Exact<{ [key: string]: never }>;

export type TeamQuery = {
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
        lastName: string | null;
        displayName: string | null;
        role: string | null;
        projects: any | null;
        githubNick: string | null;
        image: {
          __typename?: 'Asset';
          filename: string;
          alt: string | null;
        } | null;
      } | null;
    } | null> | null;
  } | null;
};

export type TeamMemberQueryVariables = Types.Exact<{
  slug: Types.Scalars['ID'];
}>;

export type TeamMemberQuery = {
  __typename?: 'QueryType';
  PersonItem: {
    __typename?: 'PersonItem';
    slug: string | null;
    id: number | null;
    content: {
      __typename?: 'PersonComponent';
      firstName: string | null;
      lastName: string | null;
      displayName: string | null;
      role: string | null;
      githubNick: string | null;
      image: {
        __typename?: 'Asset';
        filename: string;
        alt: string | null;
      } | null;
    } | null;
  } | null;
};
