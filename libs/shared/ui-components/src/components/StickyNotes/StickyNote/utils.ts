import { StickyNoteColor } from '../types';

export const getBackgroundColor = (variant: StickyNoteColor): string => {
  return {
    [StickyNoteColor.Green]: 'bg-green',
    [StickyNoteColor.Purple]: 'bg-pink',
  }[variant];
};

export const getTextColor = (variant: StickyNoteColor): string => {
  return {
    [StickyNoteColor.Green]: 'text-black',
    [StickyNoteColor.Purple]: 'text-white',
  }[variant];
};
