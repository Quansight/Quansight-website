import { FC } from 'react';
import { TIntertwinedArticleItemProps } from './types';
import { Picture, createMarkup } from '@quansight/shared/ui-components';

export const IntertwinedArticleItem: FC<TIntertwinedArticleItemProps> = ({
  text,
  imageSrc,
  imageAlt,
}) => {
  return (
    <section className="flex flex-col-reverse gap-16 justify-center items-center mb-16 sm:flex-row sm:odd:flex-row-reverse sm:gap-32">
      <div
        className="flex flex-col gap-8 text-[1.6rem] font-normal leading-[2.7rem] text-black sm:w-1/2"
        dangerouslySetInnerHTML={createMarkup(text)}
      />
      <div className="relative w-full h-32 bg-red-500 sm:w-1/2 sm:h-[40rem]">
        <Picture
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          layout="fill"
          priority
        />
      </div>
    </section>
  );
};
