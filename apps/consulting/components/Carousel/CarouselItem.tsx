import { FC } from 'react';
import { useSwiperSlide } from 'swiper/react';

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
  const swiperSlide = useSwiperSlide();

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="relative h-[22rem] w-full sm:h-[32.7rem]">
        <Picture
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority
        />
      </div>
      <div className="bg-violet flex min-h-[27.6rem] flex-col pt-[4.1rem] text-center text-white sm:min-h-[32.7rem] sm:basis-[30rem] sm:px-[3.7rem] sm:pb-[4.6rem] sm:text-left">
        <div>
          <p className="text-[1.6rem] font-normal capitalize leading-[3rem]">
            {postType}
          </p>
          <LibraryLink link={link} tabIndex={swiperSlide.isActive ? 0 : -1}>
            <h3 className="font-heading text-[3rem] font-extrabold leading-[3.7rem] sm:w-[22.7rem]">
              {title}
            </h3>
          </LibraryLink>
          <p className="text-[1.2rem] leading-[2.7rem]">By {author}</p>
        </div>
        <p className="my-[2.1rem] text-[1.2rem] leading-[2.7rem] sm:mt-auto">
          {date}
        </p>
      </div>
    </div>
  );
};
