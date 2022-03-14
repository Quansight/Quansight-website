import { ComponentType } from './types';
import { Feature } from '../Feature/Feature';
import { Teaser } from '../Teaser/Teaser';
import { Qconsulting } from '../Qconsulting/Qconsulting';
import { QconsultingItem } from '../QconsultingItem/QconsultingItem';
import { QconsultingBtn } from '../QconsultingBtn/QconsultingBtn';
import { QconsultingParagraph } from '../QconsultingParagraph/QconsultingParagraph';

export const componentsMap = {
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Feature]: Feature,
  [ComponentType.Qconsulting]: Qconsulting,
  [ComponentType.QconsultingItem]: QconsultingItem,
  [ComponentType.QconsultingBtn]: QconsultingBtn,
  [ComponentType.QconsultingParagraph]: QconsultingParagraph,
};
