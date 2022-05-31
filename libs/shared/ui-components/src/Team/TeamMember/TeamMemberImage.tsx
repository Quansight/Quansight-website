import { FC } from 'react';

import { Picture } from '../../Picture/Picture';
import { TeamShape } from '../types';
import { TTeamMemberImage } from './types';

export const TeamMemberImage: FC<TTeamMemberImage> = ({ image, shape }) => (
  <div className="flex relative mb-[0.5rem] md:mb-[1rem]">
    <Picture
      imageSrc={image.filename}
      imageAlt={image.alt ? image.alt : ''}
      width={200}
      height={shape === TeamShape.Square ? 200 : 240}
      objectFit="cover"
      className="brightness-110 grayscale"
    />
    <span className="absolute top-0 left-0 w-full h-full opacity-25 z-2 bg-violet" />
  </div>
);
