import { TRichText } from '@quansight/shared/types';

export enum StickyNoteColor {
  Green = 'green',
  Pink = 'pink',
  Violet = 'violet',
}

export enum StickyNoteSize {
  Base = 'base',
  Medium = 'medium',
  Big = 'big',
}

export enum StickyNotesVariant {
  Asymmetric = 'asymmetric',
  Symmetric = 'symmetric',
}

export type TStickyNoteProps = {
  title?: string;
  description: TRichText;
  descriptionSize: StickyNoteSize;
  buttonText?: string;
  buttonLink?: string;
  variant: StickyNoteColor;
};

export type TStickyNoteComponentProps = {
  title?: TStickyNoteProps['title'];
  description: TStickyNoteProps['description'];
  descriptionSize: TStickyNoteProps['descriptionSize'];
  buttonText?: TStickyNoteProps['buttonText'];
  buttonLink?: TStickyNoteProps['buttonLink'];
  variant: TStickyNoteProps['variant'];
  isFirst: boolean;
  isLast: boolean;
  notesVariant: StickyNotesVariant;
};
