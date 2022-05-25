import { FC } from 'react';

import { TProjectItemProps } from './types';

export const ProjectsItem: FC<TProjectItemProps> = ({
  title,
  image,
  shortDescription,
  longDescription,
  linkText,
  projectLink,
}) => {
  return <li>ProjectsItem</li>;
};
