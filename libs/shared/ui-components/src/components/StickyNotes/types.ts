export enum StickyNoteColor {
  Green = 'green',
  Pink = 'pink',
}

export type TStickyNoteProps = {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  variant: StickyNoteColor;
};

export type TStickyNotesProps = {
  items: TStickyNoteProps[];
};
