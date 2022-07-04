import { FC } from 'react';

import clsx from 'clsx';

import { TeamMember } from './TeamMember/TeamMember';
import { TeamVariant, TTeamProps, TeamDisplay } from './types';
import { filterTeam, getRandomMembers } from './utils';

export const Team: FC<TTeamProps> = ({
  variant,
  header,
  role,
  team,
  imagesShape,
}) => {
  const filteredTeam = filterTeam(team, role);
  const teamToDisplay =
    variant === TeamVariant.Spotlight
      ? getRandomMembers(filteredTeam, 3)
      : filteredTeam;

  const needHeadingSpace = teamToDisplay?.reduce(
    (prevValue, { displayName, firstName, lastName }) => {
      const rawName =
        displayName === TeamDisplay.Full
          ? `${firstName} ${lastName}`
          : firstName;

      return rawName?.length <= 15 && prevValue === false ? false : true;
    },
    false,
  );

  return (
    <section className="px-[1.8rem] my-[6rem] mx-auto md:my-[8rem] lg:px-[3rem] xl:px-[18rem] max-w-layout">
      <h2
        className="
          text-[4rem] font-extrabold leading-[4.9rem] text-center md:text-[4.8rem]
          text-violet font-heading
        "
      >
        {header}
      </h2>
      <ul
        className={clsx(
          'flex flex-wrap md:justify-center',
          needHeadingSpace ? 'mt-[4rem]' : 'mt-[1.5rem]',
        )}
      >
        {teamToDisplay
          ?.filter((item) => item)
          .map((item) => (
            <TeamMember key={item.firstName} shape={imagesShape} {...item} />
          ))}
      </ul>
    </section>
  );
};
