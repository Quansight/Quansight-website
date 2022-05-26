import { getUrl } from '@quansight/shared/utils';

import { TProjectsRawData } from '../../../types/storyblok/bloks/projects';
import { TProjectsProps } from '../../Projects/types';

export const getProjectsProps = (blok: TProjectsRawData): TProjectsProps => ({
  projects: blok.projects.map(
    ({
      _uid,
      title,
      image: { filename, alt },
      shortDescription,
      longDescription,
      linkText,
      projectLink,
    }) => ({
      _uid,
      title,
      imageSrc: filename,
      imageAlt: alt,
      shortDescription,
      longDescription,
      linkText,
      linkUrl: getUrl(projectLink),
    }),
  ),
});
