import { FC, useState } from 'react';
import { TIntertwinedArticleItemProps } from './types';
import { Picture, createMarkup } from '@quansight/shared/ui-components';

export const IntertwinedArticleItem: FC<TIntertwinedArticleItemProps> = ({
  text,
  imageSrc,
  imageAlt,
}) => {
  const [imageSizes, setImageSizes] = useState({ width: 0, height: 0 });
  return (
    <section className="flex flex-col-reverse gap-16 justify-center items-center mb-16 sm:flex-row sm:odd:flex-row-reverse sm:gap-32">
      <div
        className="flex flex-col gap-8 text-[1.6rem] font-normal leading-[2.7rem] text-left text-black sm:w-1/2"
        dangerouslySetInnerHTML={createMarkup(text)}
      />
      <div className="flex relative justify-center items-center w-full sm:w-1/2">
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
