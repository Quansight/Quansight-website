import { FC } from 'react';

export const Loading: FC = () => (
  <div className="relative">
    <p className="sr-only" role="alert">
      Loading data
    </p>
    <div
      aria-hidden="true"
      className="flex items-center justify-center space-x-2"
    >
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-violet h-8 w-8 animate-pulse rounded-full motion-reduce:animate-none"
        ></div>
      ))}
    </div>
  </div>
);
