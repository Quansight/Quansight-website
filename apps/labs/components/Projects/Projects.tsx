import { FC } from 'react';

import { ProjectsItem } from './ProjectsItem';
import { TProjectsProps } from './types';

export const Projects: FC<TProjectsProps> = ({ projects }) => {
  return (
    <section title="List of our projects">
      {projects.map((project) => (
        <ProjectsItem key={project._uid} {...project} />
      ))}
    </section>
  );
};
