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

export type TState = {
  data?: {
    jobs: TJobListItem[] | null;
  };
  error?: Error | null;
};

export type TAction =
  | { type: 'loading' }
  | { type: 'fetched'; payload: TJobListItem[] }
  | { type: 'error'; payload: Error };
