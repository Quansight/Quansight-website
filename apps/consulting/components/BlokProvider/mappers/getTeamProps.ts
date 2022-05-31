import { TTeamProps } from '@quansight/shared/ui-components';

import { TTeamRawData } from '../../../types/storyblok/bloks/team';

export const getTeamProps = (blok: TTeamRawData): TTeamProps => ({
  variant: blok.variant,
  header: blok.header,
  role: blok.role,
  team: blok.team.map((item) => ({
    displayName: item.content.displayName,
    firstName: item.content.firstName,
    lastName: item.content.lastName,
    image: item.content.image,
    role: item.content.role,
    githubNick: item.content.githubNick,
    projects: item.content.projects
      ? item.content.projects.map((project) => ({
          name: project.name,
        }))
      : null,
  })),
  imagesShape: blok.imagesShape,
});
