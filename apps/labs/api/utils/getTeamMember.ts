import pick from 'lodash/pick';

import { Api } from '@quansight/shared/storyblok-sdk';

import { PersonItem } from '../types/basic';
import { TeamMemberDocument } from '../types/hooks';
import { TeamMemberQuery } from '../types/operations';

export const getTeamMember = async (
  slug: string,
  preview: boolean,
): Promise<Pick<PersonItem, 'id' | 'slug' | 'content'>> => {
  const { data } = await Api.getTeamMemberBySlug<TeamMemberQuery>(
    TeamMemberDocument,
    slug,
    preview,
  );

  // @ts-ignore type error
  return pick(data.PersonItem, ['id', 'slug', 'content']);
};
