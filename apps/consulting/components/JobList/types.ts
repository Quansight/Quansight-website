export type TJobListProps = {
  title: string;
  errorMessage: string;
  noOpeningsMessage: string;
};

type TLocation = {
  [key: string]: string;
};

export type TJobListItem = {
  absolute_url: string;
  id: number;
  location: TLocation;
  title: string;
};
