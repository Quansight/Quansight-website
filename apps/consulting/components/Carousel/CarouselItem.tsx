import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { LibraryLink } from '../LibraryLink/LibraryLink';
import { TCarouselItemProps } from './types';

export const CarouselItem: FC<TCarouselItemProps> = ({
  imageSrc,
  imageAlt,
  postType,
  title,
  author,
  date,
  link,
}) => {
  return (
    <div className="flex flex-col sm:flex-row">
      <div className="relative w-full h-[22rem] sm:h-[32.7rem]">
        <Picture
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority
        />
      </div>
      <div className="flex flex-col pt-[4.1rem] h-[27.6rem] text-center text-white sm:basis-[30rem] sm:px-[3.7rem] sm:pb-[4.6rem] sm:h-[32.7rem] sm:text-left bg-violet">
        <div>
          <p className="text-[1.6rem] font-normal leading-[3rem] capitalize">
            {postType}
          </p>
          <LibraryLink link={link}>
            <h3 className="text-[3rem] font-extrabold leading-[3.7rem] sm:w-[22.7rem] font-heading">
              {title}
            </h3>
          </LibraryLink>
          <p className="text-[1.2rem] leading-[2.7rem]">By {author}</p>
        </div>
        <p className="mt-[2.1rem] text-[1.2rem] leading-[2.7rem] sm:mt-auto">
          {date}
        </p>
      </div>
    </div>
  );
};

//  <div className="flex flex-col sm:flex-row sm:h-[32.7rem]">
//       <div className="relative w-full h-[22rem] sm:h-full">
//         <Picture
//           imageSrc={imageSrc}
//           imageAlt={imageAlt}
//           layout="fill"
//           objectFit="cover"
//           objectPosition="center"
//           priority
//         />
//       </div>
//       <div className="flex flex-col justify-between pt-[4.1rem] pb-[8.3rem] h-[27.6rem] text-center text-white sm:w-[37.9rem] sm:h-full bg-violet">
//         <p className="text-[1.6rem] font-normal leading-[3rem] capitalize">
//           {postType}
//         </p>
//         <LibraryLink link={link}>
//           <h3 className="text-[3rem] font-extrabold leading-[3.7rem] font-heading">
//             {title}
//           </h3>
//         </LibraryLink>
//         <div className="mt-[2.1rem] text-[1.2rem] leading-[2.7rem] sm:flex sm:justify-between sm:items-center">
//           <p className="hidden sm:block">By {author}</p>
//           <p>{date}</p>
//         </div>
//       </div>
//     </div>
