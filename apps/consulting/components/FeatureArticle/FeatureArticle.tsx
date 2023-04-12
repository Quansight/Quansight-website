import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';
import { createMarkup } from '@quansight/shared/utils';

import { TFeatureArticleProps } from './types';

export const FeatureArticle: FC<TFeatureArticleProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  decorationSrc,
  decorationAlt,
}) => {
  return (
    <article className="max-w-layout mx-auto grid grid-rows-[auto,auto,auto] gap-x-12 gap-y-14 py-24 pr-20 pl-8 sm:grid-cols-[1fr,1fr] sm:grid-rows-[auto,1fr] sm:px-16 lg:grid-cols-[3fr,2fr] lg:px-[13rem] xl:grid-cols-[6fr,5fr]">
      <h2 className="text-violet font-heading text-left text-[4rem] font-extrabold leading-[4.8rem] lg:text-[4.8rem]">
        {title}
      </h2>
      <div className="my-24 self-center sm:row-span-2 sm:my-0">
        {decorationSrc && decorationAlt && (
          <div className="relative h-36 sm:h-44">
            <Picture
              imageSrc={decorationSrc}
              imageAlt={decorationAlt}
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        )}

        <div className="relative h-64 sm:h-[19rem] xl:h-[22rem]">
          <Picture
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
      </div>
      <div
        className="flex flex-col gap-12 text-[1.6rem] leading-[2.7rem] text-black lg:pr-24 xl:pr-0"
        dangerouslySetInnerHTML={createMarkup(description)}
      />
    </article>
  );
};
