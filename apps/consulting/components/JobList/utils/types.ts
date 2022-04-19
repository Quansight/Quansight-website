import { TJobListItem } from '../types';

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
