import { TState, TAction } from '../types';
import { initialState } from './config';

export const jobsReducer = (state: TState, action: TAction): TState => {
  switch (action.type) {
    case 'loading':
      return { ...initialState };
    case 'fetched':
      return { ...initialState, data: { jobs: action.payload } };
    case 'error':
      return { ...initialState, error: action.payload };
    default:
      return state;
  }
};
