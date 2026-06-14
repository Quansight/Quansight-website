import type { FC } from 'react';

import { ProjectsItem, type ProjectItemData } from './ProjectsItem';

type ProjectsProps = {
  items: ProjectItemData[];
};

export const Projects: FC<ProjectsProps> = ({ items }) => (
  <section
    aria-label="List of our projects"
    className="flex flex-col gap-[6rem] px-[3.5rem] pb-[10rem] mx-auto sm:gap-[3.1rem] sm:px-[5.7rem] lg:gap-[2.6rem] lg:px-[11.7rem] xl:px-[14.1rem] xl:pb-[14rem] max-w-layout"
  >
    {items.map((project) => (
      <ProjectsItem key={project.title} {...project} />
    ))}
  </section>
);
