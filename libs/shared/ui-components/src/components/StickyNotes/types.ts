export enum StickyNoteColor {
  Green = 'green',
  Purple = 'purple',
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
