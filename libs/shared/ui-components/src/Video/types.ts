import { TImage, TRichText } from '@quansight/shared/types';

type TSizeVariants = 'small' | 'medium' | 'large';
type TAlignVariants = 'left' | 'right' | 'center';
type TSpaceVariants = 'none' | 'small' | 'large';

export type TVideoProps = {
  url?: string;
  thumbnail: TImage;
  size: TSizeVariants;
  align: TAlignVariants;
  title: string;
  sideText: TRichText;
  text: TRichText;
  topSpace: TSpaceVariants;
  bottomSpace: TSpaceVariants;
};

export type TVideoThumbnailProps = {
  src: string;
  alt: string;
  onClick: () => void;
};
