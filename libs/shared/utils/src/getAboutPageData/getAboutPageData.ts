import { Maybe } from 'graphql/jsutils/Maybe';

import {
  PageComponent,
  PageItem,
  PersonItem,
} from '@quansight/shared/storyblok-sdk';

const mapAboutPageComponents = (
  pageContent: Maybe<PageComponent>,
  teamData: PersonItem,
): PageComponent[] | [] => {
  return pageContent?.body.map(
    (item: PageComponent): PageComponent | { team: PersonItem } => {
      return item.component === 'team' ? { ...item, team: teamData } : item;
    },
  );
};

export const getAboutPageData = (
  pageData: PageItem,
  teamData: PersonItem,
): PageItem => {
  const aboutPageComponents = mapAboutPageComponents(
    pageData?.content,
    teamData,
  );
  const aboutPageContent = { ...pageData.content, body: aboutPageComponents };
  const aboutPageData = Object.assign({}, pageData, {
    content: aboutPageContent,
  });

  return aboutPageData;
};
