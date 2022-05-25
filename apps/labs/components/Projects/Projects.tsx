import { FC } from 'react';

import { ProjectsItem } from './ProjectsItem';
import { TProjectsProps } from './types';

export const Projects: FC<TProjectsProps> = ({ projects }) => {
  return (
    <section className="relative">
      <h2 className="sr-only">Section title</h2>
      <ul>
        {projects.map((project) => (
          <ProjectsItem key={project._uid} {...project} />
        ))}
      </ul>
    </section>
  );
};
