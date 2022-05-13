import {
  PageComponent,
  PageItem,
  PersonItem,
} from '@quansight/shared/storyblok-sdk';

export const getAboutPageData = (
  pageData: PageItem,
  teamData: PersonItem,
): PageItem => {
  const mapAboutPageComponents = (): PageComponent[] | [] => {
    const mappedAboutComponents = [];

    if (pageData && pageData.content) {
      pageData.content.body.map((item: PageComponent): void => {
        const componentItem =
          item.component === 'team' ? { ...item, team: teamData } : item;
        mappedAboutComponents.push(componentItem);
        return;
      });
    }

    return mappedAboutComponents;
  };

  const aboutPageComponents = mapAboutPageComponents();
  const aboutPageContent = Object.assign({}, pageData.content, {
    body: aboutPageComponents,
  });
  const aboutPageData = Object.assign({}, pageData, {
    content: aboutPageContent,
  });

  return aboutPageData;
};
