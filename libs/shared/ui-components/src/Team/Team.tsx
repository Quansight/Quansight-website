import { FC } from 'react';

import clsx from 'clsx';

import { TeamMember } from './TeamMember/TeamMember';
import { TeamVariant, TTeamProps } from './types';
import { filterTeam, getRandomMembers, checkNamesOverflow } from './utils';

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

  const needHeadingSpace = checkNamesOverflow(teamToDisplay);

  return (
    <section className="max-w-layout mx-auto my-[6rem] px-[1.8rem] md:my-[8rem] lg:px-[3rem] xl:px-[18rem]">
      <h2
        className="
          text-violet font-heading text-center text-[4rem] font-extrabold
          leading-[4.9rem] md:text-[4.8rem]
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
