type TJobItem = {
  _uid: string;
  jobTitle: string;
  linkUrl: string;
  location: string;
  isRemote: boolean;
};

export type TJobOpeningsProps = {
  title: string;
  jobs: TJobItem[];
};
