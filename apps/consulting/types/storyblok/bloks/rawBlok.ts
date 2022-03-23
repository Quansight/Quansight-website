import { TBoardRawData } from './board';
import { THeroRawData } from './hero';
import { TStickyNotesRawData } from './stickyNotes';
import { TTeaserRawData } from './teaser';

export type TRawBlok =
  | THeroRawData
  | TBoardRawData
  | TTeaserRawData
  | TStickyNotesRawData;
