import { FC } from 'react';
import { Picture } from '../Picture/Picture';

export type TFeatureArticleProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const FeatureArticle: FC<TFeatureArticleProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
}) => {
  return (
    <section>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="relative">
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

export default FeatureArticle;
