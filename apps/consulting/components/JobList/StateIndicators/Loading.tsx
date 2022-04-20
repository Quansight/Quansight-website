import { FC } from 'react';

export const Loading: FC = () => (
  <div className="relative">
    <p className="sr-only" role="alert">
      Loading data
    </p>
    <div
      aria-hidden="true"
      className="flex justify-center items-center space-x-2"
    >
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="w-8 h-8 rounded-full animate-pulse motion-reduce:animate-none bg-violet"
        ></div>
      ))}
    </div>
  </div>
);
