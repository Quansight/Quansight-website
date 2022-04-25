import { TTeamProps } from '../../Team/types';
import { TTeamRawData } from '../../../types/storyblok/bloks/team';

export const getTeamProps = (blok: TTeamRawData): TTeamProps => ({
  variant: blok.variant,
  header: blok.header,
  people: blok.people.map((item) => ({
    _uid: item._uid,
    imageSrc: item.image.filename,
    imageAlt: item.image.alt,
    name: item.name,
  })),
});
