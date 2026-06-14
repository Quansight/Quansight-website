import type { FC } from 'react';

import clsx from 'clsx';

import { TeamMember, type TeamPerson } from './TeamMember';

type TeamVariant = 'all' | 'spotlight';
type TeamShape = 'square' | 'rectangle';

type TeamProps = {
  header: string;
  variant: TeamVariant;
  imagesShape: TeamShape;
  people: TeamPerson[];
};

const checkNamesOverflow = (people: TeamPerson[]): boolean =>
  people.reduce((overflow, { displayName, firstName, lastName }) => {
    const name = displayName === 'full' ? `${firstName} ${lastName}` : firstName;
    return name.length <= 15 && !overflow ? false : true;
  }, false);

const getRandomMembers = (people: TeamPerson[], n: number): TeamPerson[] =>
  [...people].sort(() => 0.5 - Math.random()).slice(0, n);

export const Team: FC<TeamProps> = ({ header, variant, imagesShape, people }) => {
  const toDisplay =
    variant === 'spotlight' ? getRandomMembers(people, 3) : people;
  const needHeadingSpace = checkNamesOverflow(toDisplay);

  return (
    <section className="px-[1.8rem] my-[6rem] mx-auto md:my-[8rem] lg:px-[3rem] xl:px-[18rem] max-w-layout">
      <h2 className="text-[4rem] font-extrabold leading-[4.9rem] text-center md:text-[4.8rem] text-violet font-heading">
        {header}
      </h2>
      <ul
        className={clsx(
          'flex flex-wrap md:justify-center',
          needHeadingSpace ? 'mt-[4rem]' : 'mt-[1.5rem]',
        )}
      >
        {toDisplay.map((person) => (
          <TeamMember
            key={person.firstName + person.lastName}
            shape={imagesShape}
            {...person}
          />
        ))}
      </ul>
    </section>
  );
};
