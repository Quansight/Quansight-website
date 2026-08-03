import type { FC } from 'react';

export const TeamMemberProjects: FC<{ projects: string[] }> = ({ projects }) => (
  <ul className="mt-[1rem]">
    {projects.map((name) => (
      <li
        key={name}
        className="text-[1.4rem] leading-[2.5rem] text-black md:text-[1.6rem]"
      >
        {name}
      </li>
    ))}
  </ul>
);
