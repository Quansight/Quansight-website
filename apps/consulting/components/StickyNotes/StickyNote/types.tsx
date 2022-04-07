import { TRichText } from '@quansight/shared/types';
import { StickyNotesVariant } from '../types';

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

export type TStickyNoteProps = {
  title?: string;
  description: TRichText;
  descriptionSize: StickyNoteSize;
  buttonText?: string;
  buttonLink?: string;
  variant: StickyNoteColor;
};

export type TStickyNoteComponentProps = {
  isFirst: boolean;
  isLast: boolean;
  notesVariant: StickyNotesVariant;
} & TStickyNoteProps;
