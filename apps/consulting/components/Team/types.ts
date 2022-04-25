export enum TeamVariant {
  All = 'all',
  Spotlight = 'spotlight',
}

export type TTeamMemberProps = {
  _uid: string;
  imageSrc: string;
  imageAlt: string;
  name: string;
};

export type TTeamProps = {
  variant: TeamVariant;
  header: string;
  people: TTeamMemberProps[];
};
