import { useState } from 'react';

import clsx from 'clsx';
import ReactPlayer from 'react-player';

import { createMarkup } from '@quansight/shared/utils';

import { VideoThumbnail } from './VideoThumbnail';
import { TVideoProps } from './types';

const youtubeConfig = {
  autoplay: 1 as const,
  disablekb: 1 as const,
  enablejsapi: 1 as const,
  controls: 1 as const,
};

const vimeoConfig = {
  autoplay: true,
  volume: false,
  muted: false,
  keyboard: false,
  pip: true,
  controls: true,
  title: true,
};

const videoSizeStyles: Record<TVideoProps['size'], string> = {
  small: 'lg:w-1/2 lg:min-w-[50%] lg:pt-[28.125%]',
  medium: 'lg:w-3/4 lg:min-w-[75%] lg:pt-[42.18%]',
  large: '',
};

const alignVideoStyles: Record<TVideoProps['align'], string> = {
  left: 'lg:flex-row',
  right: 'lg:flex-row-reverse',
  center: 'flex-col',
};

const topSpaceStyles: Record<TVideoProps['topSpace'], string> = {
  none: 'mt-0',
  small: 'mt-[4rem] xl:mt-[8rem]',
  large: 'mt-[6rem] xl:mt-[10rem]',
};

const bottomSpaceStyles: Record<TVideoProps['bottomSpace'], string> = {
  none: 'mb-0',
  small: 'mb-[4rem] xl:mb-[8rem]',
  large: 'mb-[6rem] xl:mb-[10rem]',
};

const textStyles =
  'my-[1.6rem] text-[1.6rem] text-black marker:text-black sm:text-[1.8rem] sm:my-[4rem] lg:mx-[7rem] xl:leading-[2.7rem] w-auto text-justify';

export const Video = ({
  url,
  thumbnail,
  size,
  align,
  title,
  sideText,
  text,
  topSpace,
  bottomSpace,
}: TVideoProps) => {
  const [playing, setPlaying] = useState(false);

  const handleToggleVideoPlay = () => setPlaying((prevState) => !prevState);

  if (!url) {
    return null;
  }

  const playerConfig = {
    vimeo: vimeoConfig,
    youtube: youtubeConfig,
  };

  const styles = {
    header: `
      mb-[5.6rem] text-[4rem] font-extrabold leading-[4.9rem] text-center font-heading text-violet
      sm:mx-auto sm:max-w-[70rem] sm:text-[4.8rem] sm:leading-[5.3rem]
      xl:mb-[6.8rem]
    `,
    player: clsx(
      'relative pt-[56.25%] mx-auto w-full',
      videoSizeStyles[size || 'large'],
    ),
    text: clsx(textStyles, 'hidden', size === 'small' && 'lg:block'),
    video: clsx(
      size === 'small' && 'lg:flex lg:gap-[4rem] lg:items-center xl:gap-[8rem]',
      size === 'small' && alignVideoStyles[align || 'left'],
      size === 'medium' && alignVideoStyles[align || 'left'],
    ),
    wrapper: clsx(
      'px-[1.8rem] mx-auto md:px-[3rem] xl:px-[15rem] max-w-layout',
      topSpaceStyles[topSpace || 'small'],
      bottomSpaceStyles[bottomSpace || 'small'],
    ),
  };

  return (
    <div className={styles.wrapper}>
      {title && <h2 className={styles.header}>{title}</h2>}
      <div className={styles.video}>
        <div className={styles.player}>
          {thumbnail?.filename && (
            <VideoThumbnail
              src={thumbnail.filename}
              alt={thumbnail.alt || 'video thumbnail'}
              onClick={handleToggleVideoPlay}
            />
          )}
          <ReactPlayer
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            src={url}
            playing={playing}
            config={playerConfig}
          />
        </div>
        {sideText && (
          <div
            className={styles.text}
            dangerouslySetInnerHTML={createMarkup(sideText)}
          />
        )}
      </div>
      {text && (
        <div
          className={textStyles}
          dangerouslySetInnerHTML={createMarkup(text)}
        />
      )}
    </div>
  );
};
