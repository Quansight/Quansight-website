import { useState } from 'react';

import clsx from 'clsx';

import Picture from '../Picture/Picture';
import { TVideoThumbnailProps } from './types';

const styles = {
  button: `
    absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[6rem] h-[6rem] rounded-full z-1000 bg-violet transition-[.4s] group-hover:scale-[1.1]
    before:content-[''] before:absolute before:top-[1.5rem] before:left-[2.2rem] before:w-0 before:h-0 before:border-t-[1.5rem] 
    before:border-b-[1.5rem] before:border-l-[2.4rem] before:border-r-none before:border-transparent before:border-l-white
  `,
  wrapper: `
    group overflow-hidden absolute top-0 left-0 z-10 w-full h-full transition-[.3s] cursor-pointer transition-[.4s]
    hover:brightness-110
  `,
};

export const VideoThumbnail = ({ src, alt, onClick }: TVideoThumbnailProps) => {
  const [hidden, setHidden] = useState(false);

  const wrapperStyles = clsx(styles.wrapper, hidden && 'hidden');

  const handleClick = () => {
    setHidden(true);
    onClick();
  };

  return (
    <div className={wrapperStyles} onClick={handleClick} aria-hidden={true}>
      <Picture
        imageSrc={src}
        imageAlt={alt}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
      <button className={styles.button} />
    </div>
  );
};
