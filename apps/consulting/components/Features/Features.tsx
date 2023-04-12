import { FC } from 'react';

import Feature from './Feature';
import { TFeaturesProps } from './types';

export const Features: FC<TFeaturesProps> = ({ title, columns }) => {
  return (
    <section className="bg-violet px-[2rem] pt-[6.2rem] lg:px-0 lg:pt-[8.8rem] xl:px-[5rem]">
      {title && (
        <h2
          className="
            mx-auto max-w-[120rem] text-center text-[4rem] font-extrabold leading-[5.1rem] text-white 
            lg:mb-[9.3rem] lg:text-[4.8rem]
          "
        >
          {title}
        </h2>
      )}
      <ul className="max-w-layout mx-auto flex flex-col lg:flex-row">
        {columns.map((props) => (
          <Feature {...props} key={props._uid} />
        ))}
      </ul>
    </section>
  );
};
