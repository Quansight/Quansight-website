export type TImageProps = {
  id: number,
  alt: string,
  name?: string,
  title?: string,
  filename: string,
  copyright?: string,
}

export type TPictureProps = {
  image: TImageProps,
  width?: number,
  height?: number,
  layout?: 'fixed' | 'fill' | 'intrinsic' | 'responsive'
}
