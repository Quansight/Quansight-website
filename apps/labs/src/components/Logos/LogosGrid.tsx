import type { FC } from 'react';

type LogoItem = {
  src: string;
  alt: string;
};

export const LogosGrid: FC<{ grid: LogoItem[] }> = ({ grid }) => (
  <ul className="flex flex-wrap gap-y-[2rem] justify-center w-full md:gap-y-[3rem]">
    {grid.map(({ src, alt }) => (
      <li
        key={src}
        className={`w-1/2 text-center ${grid.length === 6 ? 'lg:w-2/12' : 'lg:w-1/5'}`}
      >
        <div className="relative w-auto h-[5.3rem]">
          <img
            src={src}
            alt={alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      </li>
    ))}
  </ul>
);
