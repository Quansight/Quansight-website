import { FC, useState } from 'react';

import { ProjectDescription } from './ProjectDescription';
import { ProjectHeadline } from './ProjectHeadline';
import { ProjectLogo } from './ProjectLogo';
import { ProjectSummary } from './ProjectSummary';
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
  const [isDroprownExpanded, setIsDropdownExpanded] = useState(false);
  return (
    <div className="grid grid-rows-[auto,auto,auto,auto] sm:grid-cols-[1fr,auto] sm:grid-rows-[auto,auto,auto]">
      <ProjectHeadline
        title={title}
        isDroprownExpanded={isDroprownExpanded}
        setIsDropdownExpanded={setIsDropdownExpanded}
      />
      <ProjectLogo
        isDroprownExpanded={isDroprownExpanded}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
      />
      <ProjectSummary shortDescription={shortDescription} />
      <ProjectDescription
        isDroprownExpanded={isDroprownExpanded}
        longDescription={longDescription}
        linkText={linkText}
        linkUrl={linkUrl}
        title={title}
      />
    </div>
  );
};
