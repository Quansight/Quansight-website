import { TStickyNoteProps } from './StickyNote/types';

export enum StickyNotesVariant {
  Asymmetric = 'asymmetric',
  Symmetric = 'symmetric',
}

export type TStickyNotesProps = {
  variant: StickyNotesVariant;
  items: TStickyNoteProps[];
};
