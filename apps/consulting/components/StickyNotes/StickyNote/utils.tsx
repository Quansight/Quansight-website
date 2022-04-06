import { StickyNoteColor, StickyNoteSize, StickyNotesVariant } from './types';

export const getFirstNoteMargins = (variant: StickyNotesVariant): string => {
  return {
    [StickyNotesVariant.Asymmetric]: 'sm:mb-[8rem]',
    [StickyNotesVariant.Symmetric]: 'sm:mt-[3rem] sm:mr-[2rem]',
  }[variant];
};

export const getLastNoteMargins = (variant: StickyNotesVariant): string => {
  return {
    [StickyNotesVariant.Asymmetric]: 'sm:mt-[4.5rem]',
    [StickyNotesVariant.Symmetric]: 'sm:ml-[2rem]',
  }[variant];
};

export const getBackgroundColor = (variant: StickyNoteColor): string => {
  return {
    [StickyNoteColor.Green]: 'bg-green',
    [StickyNoteColor.Pink]: 'bg-pink',
    [StickyNoteColor.Violet]: 'bg-violet',
  }[variant];
};

export const getTextColor = (variant: StickyNoteColor): string => {
  return {
    [StickyNoteColor.Green]: 'text-black',
    [StickyNoteColor.Pink]: 'text-white',
    [StickyNoteColor.Violet]: 'text-white',
  }[variant];
};

export const getTextSize = (size: StickyNoteSize): string => {
  return {
    [StickyNoteSize.Base]:
      'text-[2rem] font-bold leading-[2.8rem] sm:text-[2.5rem] sm:leading-[3.3rem]',
    [StickyNoteSize.Medium]:
      'text-[2.7rem] leading-[3.8rem] sm:p-[1rem] sm:text-[3rem] sm:leading-[4.9rem]',
    [StickyNoteSize.Big]:
      'text-[4rem] leading-[4.9rem] sm:p-[2rem] sm:text-[4.8rem]',
  }[size];
};
