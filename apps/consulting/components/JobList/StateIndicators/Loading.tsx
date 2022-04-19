import { FC } from 'react';

export const Loading: FC = () => (
  <div className="flex justify-center items-center space-x-2">
    <div className="w-8 h-8 rounded-full  animate-pulse bg-violet"></div>
    <div className="w-8 h-8 rounded-full delay-100 animate-pulse bg-violet"></div>
    <div className="w-8 h-8 rounded-full delay-200 animate-pulse bg-violet"></div>
  </div>
);
