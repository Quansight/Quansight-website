import { TBlok, TLink } from '@quansight/shared/config';
import { StickyNoteColor } from '@quansight/shared/ui-components';
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
