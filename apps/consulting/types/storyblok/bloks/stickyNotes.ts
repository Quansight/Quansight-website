import { TBlok, TLink, TRichText } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';
import { StickyNotesVariant } from '../../../components/StickyNotes/types';
import {
  StickyNoteColor,
  StickyNoteSize,
} from '../../../components/StickyNotes/StickyNote/types';

type TStickyNotesItemRawData = {
  title: string;
  component: string;
  link: TLink;
  description: TRichText;
  descriptionSize: StickyNoteSize;
  buttonText: string;
  variant: StickyNoteColor;
} & TBlok;

export type TStickyNotesRawData = {
  component: ComponentType.StickyNotes;
  variant: StickyNotesVariant;
  items: TStickyNotesItemRawData[];
} & TBlok;
