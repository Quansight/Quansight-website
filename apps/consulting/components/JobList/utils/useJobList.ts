import { useEffect, useReducer } from 'react';
import { TState } from '../types';
import { jobsReducer } from './jobsReducer';
import { initialState } from './config';

export const useJobList = (url?: string): TState => {
  const [state, dispatch] = useReducer(jobsReducer, initialState);

  useEffect(() => {
    if (!url) return;
    const fetchData = async (): Promise<void> => {
      dispatch({ type: 'loading' });
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();

        dispatch({ type: 'fetched', payload: data.jobs });
      } catch (error) {
        dispatch({ type: 'error', payload: error as Error });
      }
    };

    void fetchData();
  }, [url]);

  return state;
};
