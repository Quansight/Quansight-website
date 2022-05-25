import { FC } from 'react';

import { TProjectItemProps } from './types';

export const ProjectsItem: FC<TProjectItemProps> = ({
  title,
  imageSrc,
  imageAlt,
  shortDescription,
  longDescription,
  linkText,
  linkUrl,
}) => {
  console.log(
    title,
    imageSrc,
    imageAlt,
    shortDescription,
    longDescription,
    linkText,
    linkUrl,
  );

  return <div>ProjectsItem</div>;
};
