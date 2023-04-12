import { FC, useState } from 'react';

import { Picture } from '@quansight/shared/ui-components';
import { createMarkup } from '@quansight/shared/utils';

import { TIntertwinedArticleItemProps } from './types';

export const IntertwinedArticleItem: FC<TIntertwinedArticleItemProps> = ({
  text,
  imageSrc,
  imageAlt,
}) => {
  const [imageSizes, setImageSizes] = useState({ width: 0, height: 0 });
  return (
    <section className="mb-16 flex flex-col-reverse items-center justify-center gap-16 sm:flex-row sm:gap-32 sm:odd:flex-row-reverse">
      <div
        className="flex flex-col gap-8 text-left text-[1.6rem] font-normal leading-[2.7rem] text-black sm:w-1/2"
        dangerouslySetInnerHTML={createMarkup(text)}
      />
      <div className="relative flex w-full items-center justify-center sm:w-1/2">
        <Picture
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          width={imageSizes.width}
          height={imageSizes.height}
          priority
          onLoadingComplete={({ naturalWidth, naturalHeight }) => {
            setImageSizes({ width: naturalWidth, height: naturalHeight });
          }}
        />
      </div>
    </section>
  );
};
