import { FC } from 'react';
import { TFeatureArticleProps } from './types';
import { Picture } from '../Picture/Picture';
import { createMarkup } from '../../utils';

export const FeatureArticle: FC<TFeatureArticleProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  decorationSrc,
  decorationAlt,
}) => {
  return (
    <section>
      <div>
        <h2>{title}</h2>
        <div dangerouslySetInnerHTML={createMarkup(description)} />
      </div>
      <div>
        {decorationSrc && decorationAlt && (
          <div className="relative h-32">
            <Picture
              imageSrc={decorationSrc}
              imageAlt={decorationAlt}
              layout="fill"
              priority
            />
          </div>
        )}
        <div className="relative h-32">
          <Picture
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            layout="fill"
            priority
          />
        </div>
      </div>
    </section>
  );
};
