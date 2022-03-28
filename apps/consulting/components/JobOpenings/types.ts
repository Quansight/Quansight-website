type TJobItem = {
  jobTitle: string;
  linkUrl: string;
  location: string;
  workType: string;
};

export type TJobOpeningsProps = {
  title: string;
  jobs: TJobItem[];
};
