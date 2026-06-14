import type { FC } from 'react';

type ProjectLogoProps = {
  isExpanded: boolean;
  image: string;
  imageAlt: string;
};

export const ProjectLogo: FC<ProjectLogoProps> = ({
  isExpanded,
  image,
  imageAlt,
}) => (
  <div className="sm:col-start-2 sm:col-end-3 sm:row-start-1 sm:row-end-4 sm:pt-[3rem] sm:ml-[6rem] sm:w-[20rem] lg:w-[30rem] xl:w-[35rem]">
    {isExpanded && image && imageAlt && (
      <div className="relative w-full h-[11.3rem] lg:h-[13.5rem] sm:block">
        <img
          src={image}
          alt={imageAlt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    )}
  </div>
);
