import type { FC } from 'react';

type VideoProps = {
  url: string;
};

function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return null;
}

export const Video: FC<VideoProps> = ({ url }) => {
  const embedUrl = toEmbedUrl(url);
  if (!embedUrl) {
    return (
      <a href={url} className="text-violet underline">
        Watch the video
      </a>
    );
  }
  return (
    <div className="relative w-full aspect-video">
      <iframe
        src={embedUrl}
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
