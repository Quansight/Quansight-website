import { FC } from 'react';

export const Loading: FC = () => (
  <div className="flex justify-center items-center space-x-2">
    <div className="w-8 h-8 rounded-full animate-pulse motion-reduce:animate-none bg-violet"></div>
    <div className="w-8 h-8 rounded-full animate-pulse motion-reduce:animate-none bg-violet"></div>
    <div className="w-8 h-8 rounded-full animate-pulse motion-reduce:animate-none bg-violet"></div>
  </div>
);
