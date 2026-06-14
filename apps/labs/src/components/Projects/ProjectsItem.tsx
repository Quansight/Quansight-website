'use client';

import { useState } from 'react';

import { ProjectDescription } from './ProjectDescription';
import { ProjectHeadline } from './ProjectHeadline';
import { ProjectLogo } from './ProjectLogo';
import { ProjectSummary } from './ProjectSummary';

export type ProjectItemData = {
  title: string;
  image: string;
  imageAlt: string;
  link: string;
  linkText: string;
  shortDescription: string;
  longDescription: string;
};

export const ProjectsItem = ({
  title,
  image,
  imageAlt,
  link,
  linkText,
  shortDescription,
  longDescription,
}: ProjectItemData) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="grid grid-rows-[auto,auto,auto,auto] sm:grid-cols-[1fr,auto] sm:grid-rows-[auto,auto,auto]">
      <ProjectHeadline
        title={title}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded((v) => !v)}
      />
      <ProjectLogo isExpanded={isExpanded} image={image} imageAlt={imageAlt} />
      <ProjectSummary shortDescription={shortDescription} />
      <ProjectDescription
        isExpanded={isExpanded}
        longDescription={longDescription}
        linkUrl={link}
        linkText={linkText}
        title={title}
      />
    </div>
  );
};
