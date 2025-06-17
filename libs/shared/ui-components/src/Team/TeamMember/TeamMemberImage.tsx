import { FC } from 'react';

import { TImage } from '@quansight/shared/types';

import { Picture } from '../../Picture/Picture';
import { TeamShape } from '../types';

export type TTeamMemberImage = {
  image: TImage;
  shape: TeamShape;
};

export const TeamMemberImage: FC<TTeamMemberImage> = ({ image, shape }) => (
  <div className="inline-flex relative mb-[0.5rem] md:mb-[1rem]">
    <Picture
      className="brightness-110 grayscale"
      imageSrc={image.filename}
      imageAlt={image.alt ? image.alt : ''}
      width={200}
      height={shape === TeamShape.Square ? 200 : 280}
      objectFit="cover"
    />
    <span className="absolute top-0 left-0 w-full h-full opacity-25 z-2 bg-violet" />
  </div>
);
