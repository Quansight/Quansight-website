import { FC } from 'react';

import { Picture } from '../Picture/Picture';
import { TeamDisplay, TTeamMemberProps } from './types';

export const TeamMember: FC<TTeamMemberProps> = ({ person }) => {
  const displayName =
    person?.display === TeamDisplay.FullName
      ? `${person?.firstName}${person?.lastName}`
      : `${person?.firstName}`;

  return (
    <li className="box-border px-[1.25rem] mb-[5rem] w-1/2 md:mb-[7rem] md:w-1/5">
      <h3
        className="
            text-[1.8rem] font-extrabold leading-[3rem]
            md:text-[2.5rem] md:leading-[4.9rem]  
            text-violet font-heading
          "
      >
        {displayName}
      </h3>
      {person?.image && (
        <div className="relative pb-[115%] w-full h-full">
          <Picture
            imageSrc={person.image.filename}
            imageAlt={person.image.alt ? person.image.alt : ''}
            layout="fill"
            objectFit="cover"
            className="brightness-110 grayscale"
          />
          <span className="absolute top-0 left-0 w-full h-full opacity-25 z-2 bg-violet" />
        </div>
      )}
    </li>
  );
};
