import { StickyNoteColor } from '../types';

export const getBackgroundColor = (variant: StickyNoteColor): string => {
  return {
    [StickyNoteColor.Green]: 'bg-green',
    [StickyNoteColor.Pink]: 'bg-pink',
  }[variant];
};

export const getTextColor = (variant: StickyNoteColor): string => {
  return {
    [StickyNoteColor.Green]: 'text-black',
    [StickyNoteColor.Pink]: 'text-white',
  }[variant];
};
