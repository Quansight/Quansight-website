import type { FC } from 'react';

type TeamShape = 'square' | 'rectangle';

type TeamMemberImageProps = {
  image: string;
  imageAlt: string;
  shape: TeamShape;
};

export const TeamMemberImage: FC<TeamMemberImageProps> = ({
  image,
  imageAlt,
  shape,
}) => (
  <div className="inline-flex relative mb-[0.5rem] md:mb-[1rem]">
    <img
      src={image}
      alt={imageAlt}
      width={200}
      height={shape === 'square' ? 200 : 280}
      className="brightness-110 grayscale"
      style={{
        objectFit: 'cover',
        aspectRatio: `200 / ${shape === 'square' ? 200 : 280}`,
      }}
    />
    <span className="absolute top-0 left-0 w-full h-full opacity-25 z-2 bg-violet" />
  </div>
);
