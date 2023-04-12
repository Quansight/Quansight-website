import { FC } from 'react';

import { ProjectsItem } from './ProjectsItem';
import { TProjectsProps } from './types';

export const Projects: FC<TProjectsProps> = ({ projects }) => (
  <section
    title="List of our projects"
    className="max-w-layout mx-auto flex flex-col gap-[6rem] px-[3.5rem] pb-[10rem] sm:gap-[3.1rem] sm:px-[5.7rem] lg:gap-[2.6rem] lg:px-[11.7rem] xl:px-[14.1rem] xl:pb-[14rem]"
  >
    {projects.map((project) => (
      <ProjectsItem key={project._uid} {...project} />
    ))}
  </section>
);
