export type TJobListItem = {
  _uid: string;
  jobTitle: string;
  linkUrl: string;
  location: string;
  isRemote: boolean;
};

export type TJobListProps = {
  title: string;
  jobs: TJobListItem[];
};
