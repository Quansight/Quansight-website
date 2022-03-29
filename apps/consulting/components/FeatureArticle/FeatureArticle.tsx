import { FC } from 'react';
import { TFeatureArticleProps } from './types';
import { Picture, createMarkup } from '@quansight/shared/ui-components';

export const FeatureArticle: FC<TFeatureArticleProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  decorationSrc,
  decorationAlt,
}) => {
  return (
    <section className="grid grid-rows-[auto,auto,auto] gap-x-12 gap-y-14 py-24 pr-20 pl-8 mx-auto sm:grid-cols-[1fr,1fr] sm:grid-rows-[auto,1fr] sm:px-16 lg:grid-cols-[3fr,2fr] xl:grid-cols-[0.58fr,0.75fr] max-w-layout">
      <h2 className="text-[4rem] font-extrabold leading-[4.8rem] text-left lg:text-[4.8rem] text-violet font-heading">
        {title}
      </h2>
      <div className="self-center my-24 sm:row-span-2 sm:my-0">
        {decorationSrc && decorationAlt && (
          <div className="relative h-36 sm:h-44">
            <Picture
              imageSrc={decorationSrc}
              imageAlt={decorationAlt}
              layout="fill"
              priority
            />
          </div>
        )}

        <div className="relative h-64 sm:h-[19rem] xl:h-[22rem]">
          <Picture
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            layout="fill"
            priority
          />
        </div>
      </div>
      <div
        className="flex flex-col gap-12 text-[1.6rem] leading-[2.7rem] text-black lg:pr-24 xl:pr-0"
        dangerouslySetInnerHTML={createMarkup(description)}
      />
    </section>
  );
};
