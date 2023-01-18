import { useState } from 'react';

import clsx from 'clsx';
import ReactPlayer from 'react-player';

import { createMarkup } from '@quansight/shared/utils';

import { TVideoProps } from './types';

const playerOptions = {
  autoPlay: 0,
  disablekb: 1,
  showinfo: 1,
  volume: 0,
  muted: 0,
  pip: 1,
  controls: 2,
  enablejsapi: 1,
};

const sizeStyles: Record<TVideoProps['size'], string> = {
  large: 'max-w-7xl',
  medium: 'max-w-7xl',
  small: 'max-w-7xl',
};

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

  const wrapperStyles = clsx('mx-auto', sizeStyles[size || 'large']);

  return (
    <div className={wrapperStyles}>
      {title && <h3>{title}</h3>}
      <div className="relative pt-[56.25%]">
        <ReactPlayer
          width="100%"
          height="100%"
          className="absolute top-0 left-0"
          url={url}
          playing={playing}
          config={{
            vimeo: {
              playerOptions,
            },
            youtube: {
              playerVars: playerOptions,
            },
          }}
        />
      </div>
      <div dangerouslySetInnerHTML={createMarkup(text)} />
      <div dangerouslySetInnerHTML={createMarkup(sideText)} />
      <div>bottomSpace option: {bottomSpace}</div>
      <div>topSpace option: {topSpace}</div>
      <div>align option: {align}</div>
      <div>size option: {size}</div>
      <pre>Thumbnail: {JSON.stringify(thumbnail, null, 2)}</pre>
      <button onClick={handleToggleVideoPlay}>Toggle video</button>
    </div>
  );
};
