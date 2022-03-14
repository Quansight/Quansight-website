import { ComponentType } from './types';
import { Feature } from '../Feature/Feature';
import { Teaser } from '../Teaser/Teaser';
import { Qconsulting } from '../Qconsulting/Qconsulting';
import { QconsultingItem } from '../QconsultingItem/QconsultingItem';

export const componentsMap = {
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Feature]: Feature,
  [ComponentType.Qconsulting]: Qconsulting,
  [ComponentType.QconsultingItem]: QconsultingItem,
};
