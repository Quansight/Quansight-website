import { TBlok, TLink, TRichText } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';
import {
  StickyNoteColor,
  StickyNoteSize,
} from '../../../components/StickyNotes/StickyNote/types';
import { StickyNotesVariant } from '../../../components/StickyNotes/types';

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
