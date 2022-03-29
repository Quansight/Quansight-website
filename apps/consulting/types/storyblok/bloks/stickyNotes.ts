import { TBlok, TLink } from '@quansight/shared/types';
import { StickyNoteColor } from '../../../components/StickyNotes/types';
import { ComponentType } from '../../../components/BlokProvider/types';

type TStickyNotesItemRawData = {
  title: string;
  component: string;
  link: TLink;
  description: string;
  buttonText: string;
  variant: StickyNoteColor;
} & TBlok;

export type TStickyNotesRawData = {
  component: ComponentType.StickyNotes;
  items: TStickyNotesItemRawData[];
} & TBlok;
