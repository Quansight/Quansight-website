import { TState } from '../types';

export const url = process.env.NEXT_PUBLIC_GREENHOUSE_API_URL;

export const initialState: TState = {
  data: null,
  error: null,
};
