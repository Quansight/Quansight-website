import { FC, useState } from 'react';

import { ProjectsItem } from './ProjectsItem';
import { TProjectsProps } from './types';

export const Projects: FC<TProjectsProps> = ({ projects }) => {
  // const [isUI, setIsUI] = useState(false);
  return (
    <section
      title="List of our projects"
      className="flex flex-col gap-[6rem] px-[3.5rem] pb-[10rem] mx-auto sm:gap-[3.1rem] sm:px-[5.7rem] lg:gap-[2.6rem] lg:px-[11.7rem] xl:px-[14.1rem] xl:pb-[14rem] max-w-layout"
    >
      {/* <div className="grid grid-rows-[auto,auto,auto,auto] bg-slate-100 sm:grid-cols-[1fr,auto] sm:grid-rows-[auto,auto,auto]">
        <div className="flex justify-center items-center  bg-blue-100 sm:col-start-1 sm:col-end-2">
          <button onClick={() => setIsUI(!isUI)} className="py-10">
            TITLE
          </button>
        </div>
        <div className="flex justify-center items-start bg-orange-100 sm:col-start-2 sm:col-end-3 sm:row-start-2 sm:row-end-4 sm:w-[41rem]">
          {isUI && <p className="py-4">IMAGE</p>}
        </div>
        <div className="flex justify-center items-center bg-teal-100 sm:col-start-1 sm:col-end-2">
          <p className="py-12">SUMMARY</p>
        </div>
        <div className="flex justify-center items-center bg-yellow-100 sm:col-start-1 sm:col-end-2">
          {isUI && <p className="py-24">DESCRIPTION</p>}
        </div>
      </div> */}
      {projects.map((project) => (
        <ProjectsItem key={project._uid} {...project} />
      ))}
    </section>
  );
};
